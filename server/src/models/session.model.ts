import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SessionDocument extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionIdHash: string; // sha256(sid)
  userAgent?: string;
  ip?: string;
  lastSeenAt: Date;
  expiresAt: Date;
  // WebAuthn challenge state
  webauthnChallenge?: string;
  webauthnChallengeExpiresAt?: Date;
  // Step-up auth window
  stepUpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionModel extends Model<SessionDocument> {}

const SessionSchema = new Schema<SessionDocument, SessionModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: false, index: true },
    sessionIdHash: { type: String, required: true, unique: true, index: true },
    userAgent: String,
    ip: String,
    lastSeenAt: { type: Date, default: () => new Date() },
    expiresAt: { type: Date, required: true, index: true },
    webauthnChallenge: { type: String },
    webauthnChallengeExpiresAt: { type: Date },
    stepUpExpiresAt: { type: Date },
  },
  { timestamps: true },
);

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<SessionDocument, SessionModel>('Session', SessionSchema);
