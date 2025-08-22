import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendSuccess } from '../utils/apiResponse';
import { bookingRepository } from '../repositories/booking.repository';
import { Booking } from '../models/booking.model';
import { logger } from '../lib/logger';
import { audit } from '../middlewares/audit.middleware';
import { websiteRepository } from '../repositories/website.repository';
import { paymentProvider } from '../lib/payments';
import { computePolicyRefund } from '../utils/refund';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const created = await bookingRepository.create(req.body);
  sendCreated(
    res,
    { bookingCode: created.bookingCode, amounts: created.amounts, pricing: created.pricing },
    'Booking created',
  );
});

export const adminListBookings = asyncHandler(async (req: Request, res: Response) => {
  const docs = await bookingRepository.adminList(req.query);
  sendSuccess(res, docs, 'Bookings');
});

export const getBookingByCode = asyncHandler(async (req: Request, res: Response) => {
  const doc = await bookingRepository.getByCode(req.params.code);
  sendSuccess(res, doc, 'Booking details');
});

export const adminMarkPaid = asyncHandler(async (req: Request, res: Response) => {
  const { amount, method, currencyCode } = req.body as {
    amount: number;
    method: 'cash' | 'other';
    currencyCode?: string;
  };
  const doc = await bookingRepository.addManualPayment(req.params.code, {
    amount,
    method,
    currencyCode,
  } as any);
  sendSuccess(res, doc, 'Payment recorded');
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params as { code: string };
  const doc = await Booking.findOne({ bookingCode: code, isDeleted: false }).exec();
  if (!doc) throw new Error('Booking not found');
  doc.status = 'cancelled';
  await doc.save();
  logger.info({ code }, 'Booking cancelled');
  await audit(req, 'booking_cancelled', code);
  sendSuccess(res, { ok: true }, 'Booking cancelled');
});

export const refundBooking = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.params as { code: string };
  const { amount, reason } = req.body as { amount: number; reason?: string };
  const doc = await Booking.findOne({ bookingCode: code, isDeleted: false }).exec();
  if (!doc) throw new Error('Booking not found');

  const host = (req.headers.host || '').split(':')[0];
  const website = await websiteRepository.getByHost(host);

  // Compute policy-constrained refund amount
  const policy = computePolicyRefund(doc as any, website as any, amount);
  const finalAmount = policy.approvedAmount;

  // Choose latest captured provider payment to refund
  const captured = [...(doc.payments || [])]
    .filter((p) => p.status === 'captured' && p.providerPaymentId)
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))[0] as any;

  let providerRefundId: string | undefined;
  let status: 'initiated' | 'processed' | 'failed' = 'initiated';
  if (
    captured &&
    captured.provider &&
    captured.provider !== 'manual' &&
    captured.provider !== 'bank_transfer'
  ) {
    const result = await paymentProvider.refundPayment({
      providerPaymentId: captured.providerPaymentId,
      amount: finalAmount,
      currencyCode: doc.currencyCode,
      reason,
    });
    providerRefundId = result.providerRefundId;
    status = result.status;
  }

  doc.refunds = doc.refunds || [];
  doc.refunds.push({
    amount: finalAmount,
    currencyCode: doc.currencyCode,
    status: status === 'processed' ? 'processed' : 'initiated',
    createdAt: new Date(),
    provider: captured?.provider || 'manual',
    providerRefundId,
    meta: { reason, policyTier: policy.tierRate },
  } as any);
  if (status === 'processed') {
    doc.amounts.refunded += finalAmount;
  }
  await doc.save();

  logger.info({ code, amount: finalAmount, providerRefundId }, 'Refund requested');
  await audit(req, 'booking_refund', code, { amount: finalAmount, reason, providerRefundId });
  sendSuccess(
    res,
    doc,
    status === 'processed'
      ? 'Refund processed (policy applied)'
      : 'Refund initiated (policy applied)',
  );
});
