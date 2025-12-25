import mongoose, { Document, Model, Schema } from 'mongoose';

export interface PasswordResetDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordResetModel extends Model<PasswordResetDocument> {
  createResetToken(
    userId: mongoose.Types.ObjectId,
    email: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<PasswordResetDocument>;
  verifyResetToken(token: string): Promise<PasswordResetDocument | null>;
  cleanupExpiredTokens(): Promise<void>;
}

const PasswordResetSchema = new Schema<PasswordResetDocument, PasswordResetModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
    ipAddress: {
      type: String,
      maxlength: 45, // IPv6 max length
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

// TTL index for automatic cleanup of expired tokens (1 hour)
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound indexes for efficient queries
PasswordResetSchema.index({ token: 1, isUsed: 1, expiresAt: 1 });
PasswordResetSchema.index({ userId: 1, isUsed: 1 });
PasswordResetSchema.index({ email: 1, isUsed: 1, createdAt: -1 });

// Static method to create reset token
PasswordResetSchema.statics.createResetToken = async function (
  userId: mongoose.Types.ObjectId,
  email: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<PasswordResetDocument> {
  // Remove any existing unused tokens for this user
  await this.deleteMany({ userId, isUsed: false });

  // Generate secure token (32 bytes = 64 hex characters)
  const token = require('crypto').randomBytes(32).toString('hex');

  // Create new token (expires in 1 hour)
  const resetToken = new this({
    userId,
    email,
    token,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    ipAddress,
    userAgent,
  });

  return await resetToken.save();
};

// Static method to verify reset token
PasswordResetSchema.statics.verifyResetToken = async function (
  token: string,
): Promise<PasswordResetDocument | null> {
  return await this.findOne({
    token,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });
};

// Static method to cleanup expired and used tokens
PasswordResetSchema.statics.cleanupExpiredTokens = async function (): Promise<void> {
  await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } }, // Expired tokens
      { isUsed: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Used tokens older than 24 hours
    ],
  });
};

export const PasswordReset = mongoose.model<PasswordResetDocument, PasswordResetModel>(
  'PasswordReset',
  PasswordResetSchema,
);
