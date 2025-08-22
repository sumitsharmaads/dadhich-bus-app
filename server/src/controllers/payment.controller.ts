import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { paymentProvider } from '../lib/payments';
import { Booking } from '../models/booking.model';
import { logger } from '../lib/logger';
import { audit } from '../middlewares/audit.middleware';

export const initiatePayment = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params as { code: string };
  const {
    method = 'upi',
    payFull,
    amount,
  } = req.body as {
    method?: 'upi' | 'card';
    payFull?: boolean;
    amount?: number;
  };

  const booking = await Booking.findOne({ bookingCode: code, isDeleted: false }).exec();
  if (!booking) throw new Error('Booking not found');

  const due = Math.max(0, booking.pricing.total - booking.amounts.paid + booking.amounts.refunded);
  const minimumDeposit = booking.partialPayment?.enabled
    ? booking.partialPayment.minimumDepositAmount || Math.ceil(booking.pricing.total * 0.2)
    : due;

  const chargeAmount = payFull ? due : Math.min(due, amount || minimumDeposit);

  const init = await paymentProvider.initPayment({
    bookingCode: booking.bookingCode,
    amount: chargeAmount,
    currencyCode: booking.currencyCode,
    method,
  });

  booking.payments.push({
    amount: init.amount,
    currencyCode: init.currencyCode,
    method: init.method,
    provider: init.provider,
    providerOrderId: init.providerOrderId,
    status: 'initiated',
    createdAt: new Date(),
  } as any);
  await booking.save();

  logger.info(
    {
      code: booking.bookingCode,
      provider: init.provider,
      providerOrderId: init.providerOrderId,
      amount: init.amount,
    },
    'Payment initiated',
  );
  await audit(req, 'payment_initiated', booking.bookingCode, {
    provider: init.provider,
    providerOrderId: init.providerOrderId,
    amount: init.amount,
  });

  sendCreated(res, init, 'Payment initiated');
});

export const paymentWebhook = asyncHandler(async (req: Request, res: Response) => {
  const payload: any = {
    ...req.body,
    rawBody: (req as any).rawBody || undefined,
    signature: req.headers['x-razorpay-signature'] as string | undefined,
  };
  const ok = await paymentProvider.verifyWebhook(payload);
  if (!ok) {
    logger.warn({ payload }, 'Invalid webhook signature');
    throw new Error('Invalid signature');
  }

  if (payload.event === 'refund.processed' || payload.event === 'refund.failed') {
    const { providerRefundId, providerPaymentId, amount } = payload.data;
    const booking = await Booking.findOne({ 'refunds.providerRefundId': providerRefundId }).exec();
    if (!booking) {
      logger.warn({ providerRefundId }, 'Refund webhook: no booking matches');
      return sendSuccess(res, { ignored: true }, 'No booking matches');
    }
    const refund = booking.refunds?.find((r) => (r as any).providerRefundId === providerRefundId);
    if (!refund) return sendSuccess(res, { ignored: true }, 'No refund matches');

    if (payload.event === 'refund.processed') {
      (refund as any).status = 'processed';
      booking.amounts.refunded += amount;
      logger.info(
        { code: booking.bookingCode, providerRefundId, providerPaymentId, amount },
        'Refund processed',
      );
      await audit(req, 'refund_processed', booking.bookingCode, { providerRefundId, amount });
    } else {
      (refund as any).status = 'failed';
      logger.error({ code: booking.bookingCode, providerRefundId }, 'Refund failed');
      await audit(req, 'refund_failed', booking.bookingCode, { providerRefundId });
    }

    booking.amounts.due = Math.max(
      0,
      booking.pricing.total - booking.amounts.paid + booking.amounts.refunded,
    );
    await booking.save();
    return sendSuccess(res, { ok: true }, 'Refund webhook processed');
  }

  const { providerOrderId, providerPaymentId, amount, currencyCode, method } = payload.data;
  const booking = await Booking.findOne({ 'payments.providerOrderId': providerOrderId }).exec();
  if (!booking) {
    logger.warn({ providerOrderId }, 'Webhook: no booking matches');
    return sendSuccess(res, { ignored: true }, 'No booking matches');
  }

  const payment = booking.payments.find((p) => p.providerOrderId === providerOrderId);
  if (!payment) {
    logger.warn({ providerOrderId }, 'Webhook: no payment matches');
    return sendSuccess(res, { ignored: true }, 'No payment matches');
  }

  if (payload.event === 'payment.captured') {
    payment.status = 'captured';
    payment.providerPaymentId = providerPaymentId;
    payment.amount = amount;
    payment.currencyCode = currencyCode;
    payment.method = method;
    booking.amounts.paid += amount;
    logger.info(
      { code: booking.bookingCode, providerOrderId, providerPaymentId, amount },
      'Payment captured',
    );
    await audit(req, 'payment_captured', booking.bookingCode, {
      providerOrderId,
      providerPaymentId,
      amount,
    });
  } else if (payload.event === 'payment.failed') {
    payment.status = 'failed';
    payment.providerPaymentId = providerPaymentId;
    logger.error(
      { code: booking.bookingCode, providerOrderId, providerPaymentId },
      'Payment failed',
    );
    await audit(req, 'payment_failed', booking.bookingCode, { providerOrderId, providerPaymentId });
  }

  booking.amounts.due = Math.max(
    0,
    booking.pricing.total - booking.amounts.paid + booking.amounts.refunded,
  );
  if (booking.amounts.due === 0) booking.status = 'confirmed';
  await booking.save();

  sendSuccess(res, { ok: true }, 'Webhook processed');
});

export const bankTransferSubmit = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params as { code: string };
  const { amount, currencyCode, utr, bankName, paidAt } = req.body as {
    amount: number;
    currencyCode: string;
    utr: string;
    bankName?: string;
    paidAt?: Date;
  };

  const booking = await Booking.findOne({ bookingCode: code, isDeleted: false }).exec();
  if (!booking) throw new Error('Booking not found');

  booking.payments.push({
    amount,
    currencyCode,
    method: 'netbanking',
    provider: 'bank_transfer',
    providerPaymentId: utr,
    status: 'authorized',
    meta: { bankName, paidAt: paidAt || new Date() },
    createdAt: new Date(),
  } as any);
  await booking.save();

  await audit(req, 'bank_transfer_submit', booking.bookingCode, { utr, amount });
  sendCreated(res, { queued: true }, 'Bank transfer submitted for review');
});

export const bankTransferReconcile = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params as { code: string };
  const { utr, success, amount } = req.body as { utr: string; success: boolean; amount?: number };

  const booking = await Booking.findOne({ bookingCode: code, isDeleted: false }).exec();
  if (!booking) throw new Error('Booking not found');

  const payment = booking.payments.find(
    (p) => p.provider === 'bank_transfer' && p.providerPaymentId === utr,
  );
  if (!payment) throw new Error('Submission not found');

  if (success) {
    payment.status = 'captured';
    if (amount) payment.amount = amount;
    booking.amounts.paid += amount || payment.amount;
    await audit(req, 'bank_transfer_captured', booking.bookingCode, {
      utr,
      amount: amount || payment.amount,
    });
  } else {
    payment.status = 'failed';
    await audit(req, 'bank_transfer_failed', booking.bookingCode, { utr });
  }

  booking.amounts.due = Math.max(
    0,
    booking.pricing.total - booking.amounts.paid + booking.amounts.refunded,
  );
  if (booking.amounts.due === 0) booking.status = 'confirmed';
  await booking.save();

  sendSuccess(res, { ok: true }, 'Reconciled');
});
