import mongoose, { Document, Model, Schema } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'expired';
export type PaymentStatus =
  | 'initiated'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'voided';
export type PaymentMethod = 'card' | 'upi' | 'netbanking' | 'wallet' | 'cash' | 'other';

export interface Passenger {
  fullName: string;
  age?: number;
  gender?: string;
  seatCode?: string; // e.g., A1, U1
}

export interface PaymentRecord {
  amount: number;
  currencyCode: string;
  method: PaymentMethod;
  provider?: string; // e.g., razorpay, stripe, cashfree
  providerPaymentId?: string; // gateway payment id
  providerOrderId?: string; // gateway order id
  status: PaymentStatus;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

export interface RefundRecord {
  amount: number;
  currencyCode: string;
  method?: PaymentMethod;
  provider?: string;
  providerRefundId?: string;
  status: 'initiated' | 'processed' | 'failed';
  createdAt: Date;
}

export interface BookingDocument extends Document {
  bookingCode: string; // human-friendly unique code

  userId?: mongoose.Types.ObjectId; // null for guest bookings
  guestContact?: { fullName?: string; email?: string; phone?: string };

  tourId: mongoose.Types.ObjectId;
  tourSnapshot?: {
    tourName?: string;
    startDate?: Date;
    endDate?: Date;
    days?: number;
    nights?: number;
  };

  source?: {
    cityId?: mongoose.Types.ObjectId;
    cityName?: string;
    onBoarding?: string; // chosen pickup point
  };

  passengers: Passenger[];

  currencyCode: string; // e.g., INR
  pricing: {
    baseFarePerPerson: number;
    quantity: number;
    subtotal: number; // base * qty
    taxes: number;
    fees: number; // service/convenience
    discount: number; // coupon/manual
    total: number; // payable total
    couponCode?: string;
  };

  // Partial payment support
  partialPayment?: {
    enabled: boolean;
    minimumDepositAmount?: number;
    dueAmount?: number;
    dueDate?: Date;
    schedule?: { label?: string; amount: number; dueDate?: Date }[];
  };

  payments: PaymentRecord[];
  refunds?: RefundRecord[];

  amounts: {
    paid: number; // sum of successful captured payments
    refunded: number; // sum of successful refunds
    due: number; // total - paid + adjustments
  };

  status: BookingStatus;
  notes?: string;
  termsAcceptedAt?: Date;

  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingModel extends Model<BookingDocument> {}

const PassengerSchema = new Schema<Passenger>(
  {
    fullName: { type: String, required: true },
    age: Number,
    gender: String,
    seatCode: String,
  },
  { _id: false },
);

const PaymentRecordSchema = new Schema<PaymentRecord>(
  {
    amount: { type: Number, required: true },
    currencyCode: { type: String, required: true },
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cash', 'other'],
      required: true,
    },
    provider: String,
    providerPaymentId: String,
    providerOrderId: String,
    status: {
      type: String,
      enum: ['initiated', 'authorized', 'captured', 'failed', 'refunded', 'voided'],
      required: true,
    },
    meta: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false },
);

const RefundRecordSchema = new Schema<RefundRecord>(
  {
    amount: { type: Number, required: true },
    currencyCode: { type: String, required: true },
    method: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet', 'cash', 'other'],
      required: false,
    },
    provider: String,
    providerRefundId: String,
    status: { type: String, enum: ['initiated', 'processed', 'failed'], required: true },
    createdAt: { type: Date, default: () => new Date() },
  },
  { _id: false },
);

const BookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    bookingCode: { type: String, required: true, unique: true, index: true },

    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestContact: { fullName: String, email: String, phone: String },

    tourId: { type: Schema.Types.ObjectId, ref: 'Tour', required: true, index: true },
    tourSnapshot: {
      tourName: String,
      startDate: Date,
      endDate: Date,
      days: Number,
      nights: Number,
    },

    source: {
      cityId: { type: Schema.Types.ObjectId, ref: 'City' },
      cityName: String,
      onBoarding: String,
    },

    passengers: { type: [PassengerSchema], default: [] },

    currencyCode: { type: String, default: 'INR' },
    pricing: {
      baseFarePerPerson: { type: Number, required: true },
      quantity: { type: Number, required: true },
      subtotal: { type: Number, required: true },
      taxes: { type: Number, default: 0 },
      fees: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
      couponCode: String,
    },

    partialPayment: {
      enabled: { type: Boolean, default: false },
      minimumDepositAmount: Number,
      dueAmount: Number,
      dueDate: Date,
      schedule: [{ label: String, amount: Number, dueDate: Date }],
    },

    payments: { type: [PaymentRecordSchema], default: [] },
    refunds: { type: [RefundRecordSchema], default: [] },

    amounts: {
      paid: { type: Number, default: 0 },
      refunded: { type: Number, default: 0 },
      due: { type: Number, default: 0 },
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'refunded', 'expired'],
      default: 'pending',
      index: true,
    },
    notes: String,
    termsAcceptedAt: Date,

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

BookingSchema.index({ tourId: 1, status: 1, createdAt: -1 });

export const Booking = mongoose.model<BookingDocument, BookingModel>('Booking', BookingSchema);
