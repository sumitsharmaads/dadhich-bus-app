import { env } from './env';
import { logger } from './logger';
import { Booking } from '../models/booking.model';
import { SeatHold } from '../models/seatHold.model';

export function startSchedulers() {
  // Sweep pending bookings beyond TTL and cancel them; release holds
  setInterval(async () => {
    try {
      const cutoff = new Date(Date.now() - env.BOOKING_PENDING_TTL_MINUTES * 60 * 1000);
      const pending = await Booking.find({ status: 'pending', createdAt: { $lt: cutoff } })
        .limit(200)
        .exec();
      for (const b of pending) {
        b.status = 'expired';
        await b.save();
        await SeatHold.deleteMany({ bookingCode: b.bookingCode }).exec();
        logger.info({ code: b.bookingCode }, 'Booking expired and holds released');
      }
    } catch (err) {
      logger.error({ err }, 'Error sweeping expired bookings');
    }
  }, env.BOOKING_EXPIRY_SWEEP_MS).unref();
}
