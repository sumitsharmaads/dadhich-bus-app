import { WebsiteDocument } from '../models/website.model';
import { BookingDocument } from '../models/booking.model';

export interface RefundPolicyResult {
  approvedAmount: number;
  nonRefundableBase: number;
  tierRate: number;
}

export function computePolicyRefund(
  booking: Pick<BookingDocument, 'amounts' | 'pricing' | 'partialPayment' | 'tourSnapshot'>,
  website?: Pick<WebsiteDocument, 'booking'> | null,
  requestedAmount?: number,
): RefundPolicyResult {
  const start = booking.tourSnapshot?.startDate
    ? new Date(booking.tourSnapshot.startDate)
    : undefined;
  const now = new Date();
  const hoursToStart = start ? (start.getTime() - now.getTime()) / (1000 * 60 * 60) : Infinity;

  // Default tier table; could be extended to parse website.booking.cancellationPolicy string
  let tierRate = 0;
  if (hoursToStart >= 14 * 24) tierRate = 0.9;
  else if (hoursToStart >= 7 * 24) tierRate = 0.7;
  else if (hoursToStart >= 48) tierRate = 0.5;
  else if (hoursToStart >= 24) tierRate = 0.3;
  else tierRate = 0;

  const advancePercent = website?.booking?.advancePaymentPercent || 0;
  const nonRefundableByWebsite = Math.max(
    0,
    Math.round((booking.pricing.total * advancePercent) / 100),
  );
  const nonRefundableByBooking = booking.partialPayment?.minimumDepositAmount || 0;
  const nonRefundableBase = Math.max(nonRefundableByWebsite, nonRefundableByBooking);

  const maxRefundableBase = Math.max(0, booking.amounts.paid - nonRefundableBase);
  const policyRefund = Math.floor(maxRefundableBase * tierRate);

  const approvedAmount = Math.max(0, Math.min(policyRefund, requestedAmount ?? policyRefund));
  return { approvedAmount, nonRefundableBase, tierRate };
}
