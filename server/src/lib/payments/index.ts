import crypto from 'crypto';
import Razorpay from 'razorpay';
import { env } from '../env';

export interface InitPaymentInput {
  bookingCode: string;
  amount: number;
  currencyCode: string;
  method: 'upi' | 'card';
}

export interface InitPaymentResult {
  provider: 'mock' | 'razorpay';
  providerOrderId: string;
  amount: number;
  currencyCode: string;
  method: 'upi' | 'card';
  upiIntent?: string;
  cardRedirectUrl?: string;
}

export interface RefundPaymentInput {
  providerPaymentId: string;
  amount: number;
  currencyCode: string;
  reason?: string;
}

export interface RefundPaymentResult {
  provider: 'mock' | 'razorpay';
  providerRefundId: string;
  amount: number;
  currencyCode: string;
  status: 'initiated' | 'processed' | 'failed';
}

export type WebhookEvent =
  | 'payment.captured'
  | 'payment.failed'
  | 'refund.processed'
  | 'refund.failed';

export interface WebhookPayload {
  provider: 'mock' | 'razorpay';
  event: WebhookEvent;
  data: {
    providerOrderId?: string;
    providerPaymentId?: string;
    providerRefundId?: string;
    amount: number;
    currencyCode: string;
    method?: 'upi' | 'card';
  };
  signature?: string;
  rawBody?: string | Buffer;
}

export interface PaymentProvider {
  initPayment(input: InitPaymentInput): Promise<InitPaymentResult>;
  verifyWebhook(payload: WebhookPayload): Promise<boolean>;
  refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult>;
}

class MockProvider implements PaymentProvider {
  async initPayment(input: InitPaymentInput): Promise<InitPaymentResult> {
    const providerOrderId = `MOCK_${Date.now().toString(36).toUpperCase()}`;
    const upiIntent =
      input.method === 'upi'
        ? `upi://pay?pa=demo@upi&pn=Demo&am=${input.amount}&cu=${input.currencyCode}&tn=${input.bookingCode}`
        : undefined;
    const cardRedirectUrl =
      input.method === 'card' ? `https://example.test/cardpay?order=${providerOrderId}` : undefined;
    return {
      provider: 'mock',
      providerOrderId,
      amount: input.amount,
      currencyCode: input.currencyCode,
      method: input.method,
      upiIntent,
      cardRedirectUrl,
    };
  }

  async verifyWebhook(payload: WebhookPayload): Promise<boolean> {
    return !!payload?.event;
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    return {
      provider: 'mock',
      providerRefundId: `MOCKRF_${Date.now().toString(36).toUpperCase()}`,
      amount: input.amount,
      currencyCode: input.currencyCode,
      status: 'processed',
    };
  }
}

class RazorpayProvider implements PaymentProvider {
  private client: Razorpay;
  constructor() {
    this.client = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID || '',
      key_secret: env.RAZORPAY_KEY_SECRET || '',
    });
  }

  async initPayment(input: InitPaymentInput): Promise<InitPaymentResult> {
    const order = await this.client.orders.create({
      amount: Math.round(input.amount * 100),
      currency: input.currencyCode,
      receipt: input.bookingCode,
      notes: { method: input.method },
    });
    return {
      provider: 'razorpay',
      providerOrderId: order.id,
      amount: input.amount,
      currencyCode: input.currencyCode,
      method: input.method,
    };
  }

  async verifyWebhook(payload: WebhookPayload): Promise<boolean> {
    if (!env.RAZORPAY_WEBHOOK_SECRET || !payload.rawBody || !payload.signature) return false;
    const expected = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(
        typeof payload.rawBody === 'string' ? payload.rawBody : payload.rawBody.toString('utf8'),
      )
      .digest('hex');
    return expected === payload.signature;
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentResult> {
    const refund = await this.client.payments.refund(input.providerPaymentId, {
      amount: Math.round(input.amount * 100),
      notes: { reason: input.reason || 'admin_refund' },
      speed: 'optimum',
    } as any);
    const status = (refund as any)?.status === 'processed' ? 'processed' : 'initiated';
    return {
      provider: 'razorpay',
      providerRefundId: (refund as any).id,
      amount: input.amount,
      currencyCode: input.currencyCode,
      status,
    };
  }
}

function buildProvider(): PaymentProvider {
  if (env.PAYMENT_PROVIDER === 'razorpay') return new RazorpayProvider();
  return new MockProvider();
}

export const paymentProvider: PaymentProvider = buildProvider();
