import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SeatHoldDocument extends Document {
  tourId: mongoose.Types.ObjectId;
  bookingCode: string;
  seats: string[]; // seat codes
  expiresAt: Date;
  createdAt: Date;
}

export interface SeatHoldModel extends Model<SeatHoldDocument> {}

const SeatHoldSchema = new Schema<SeatHoldDocument, SeatHoldModel>(
  {
    tourId: { type: Schema.Types.ObjectId, ref: 'Tour', required: true, index: true },
    bookingCode: { type: String, required: true, index: true },
    seats: { type: [String], default: [] },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

SeatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SeatHold = mongoose.model<SeatHoldDocument, SeatHoldModel>('SeatHold', SeatHoldSchema);
