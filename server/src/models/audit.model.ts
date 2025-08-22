import mongoose, { Document, Model, Schema } from 'mongoose';

export interface AuditDocument extends Document {
  at: Date;
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  action: string;
  subject?: string; // e.g., bookingCode, userId, tourId
  meta?: Record<string, unknown>;
}

export interface AuditModel extends Model<AuditDocument> {}

const AuditSchema = new Schema<AuditDocument, AuditModel>({
  at: { type: Date, default: () => new Date(), index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  action: { type: String, required: true, index: true },
  subject: String,
  meta: { type: Schema.Types.Mixed },
});

AuditSchema.index({ action: 1, at: -1 });

export const Audit = mongoose.model<AuditDocument, AuditModel>('Audit', AuditSchema);
