import { FilterQuery } from 'mongoose';
import { Booking, BookingDocument, PaymentRecord } from '../models/booking.model';
import { Tour } from '../models/tour.model';
import { SeatHold } from '../models/seatHold.model';

function generateBookingCode(): string {
  const now = new Date();
  const part = now.getTime().toString(36).toUpperCase();
  return `BK-${part}`;
}

export const bookingRepository = {
  async create(data: Partial<BookingDocument>) {
    const tour = await Tour.findById(data.tourId).exec();
    if (!tour) throw new Error('Tour not found');

    const qty = (data.pricing as any)?.quantity || (data as any).quantity || 1;
    const base = (tour as any).pricing?.minFare || 0;

    const pricing = {
      baseFarePerPerson: base,
      quantity: qty,
      subtotal: base * qty,
      taxes: 0,
      fees: 0,
      discount: 0,
      total: base * qty,
      ...(data.pricing || {}),
    } as any;

    const doc = await Booking.create({
      bookingCode: generateBookingCode(),
      tourId: data.tourId,
      userId: data.userId,
      guestContact: data.guestContact,
      source: data.source,
      passengers: data.passengers || [],
      currencyCode: data.currencyCode || 'INR',
      pricing,
      partialPayment: data.partialPayment || { enabled: false },
      amounts: { paid: 0, refunded: 0, due: pricing.total },
      status: 'pending',
      termsAcceptedAt: new Date(),
      tourSnapshot: {
        tourName: (tour as any).tourName,
        startDate: (tour as any).startDate,
        endDate: (tour as any).endDate,
        days: (tour as any).days,
        nights: (tour as any).nights,
      },
    } as Partial<BookingDocument>);

    // Seat hold for selected seats (if any), TTL 15 minutes
    const seatCodes = (doc.passengers || []).map((p: any) => p.seatCode).filter(Boolean);
    if (seatCodes.length > 0) {
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await SeatHold.findOneAndUpdate(
        { bookingCode: doc.bookingCode, tourId: doc.tourId },
        { $set: { seats: seatCodes, expiresAt } },
        { upsert: true, new: true },
      ).exec();
    }

    return doc;
  },

  async adminList(params: any) {
    const { status, page = 1, items = 20 } = params || {};
    const match: FilterQuery<BookingDocument> = {} as any;
    if (status) (match as any).status = status;

    const docs = await Booking.find(match)
      .sort({ createdAt: -1 })
      .skip((page - 1) * items)
      .limit(items)
      .select('bookingCode status pricing.total amounts.paid amounts.due tourSnapshot createdAt')
      .exec();
    return docs;
  },

  getByCode(code: string) {
    return Booking.findOne({ bookingCode: code, isDeleted: false }).exec();
  },

  async addManualPayment(
    code: string,
    record: Omit<PaymentRecord, 'createdAt' | 'status' | 'method' | 'currencyCode'> & {
      amount: number;
      method: 'cash' | 'other';
      currencyCode?: string;
    },
  ) {
    const doc = await Booking.findOne({ bookingCode: code }).exec();
    if (!doc) throw new Error('Booking not found');
    doc.payments.push({
      amount: record.amount,
      currencyCode: record.currencyCode || doc.currencyCode,
      method: record.method,
      provider: 'manual',
      status: 'captured',
      createdAt: new Date(),
    } as any);
    doc.amounts.paid += record.amount;
    doc.amounts.due = Math.max(0, doc.pricing.total - doc.amounts.paid + doc.amounts.refunded);
    if (doc.amounts.due === 0) doc.status = 'confirmed';
    await doc.save();
    return doc;
  },
};
