import mongoose, { Document, Model, Schema } from 'mongoose';

export interface EmailVerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailVerificationModel extends Model<EmailVerificationDocument> {
  createVerificationToken(
    userId: mongoose.Types.ObjectId,
    email: string,
  ): Promise<EmailVerificationDocument>;
  verifyToken(token: string): Promise<EmailVerificationDocument | null>;
  cleanupExpiredTokens(): Promise<void>;
}

const EmailVerificationSchema = new Schema<EmailVerificationDocument, EmailVerificationModel>(
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
      lowercase: true,
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
      index: { expireAfterSeconds: 0 }, // TTL index
    },
    isUsed: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// Static method to create verification token
EmailVerificationSchema.statics.createVerificationToken = async function (
  userId: mongoose.Types.ObjectId,
  email: string,
): Promise<EmailVerificationDocument> {
  // Remove any existing tokens for this user
  await this.deleteMany({ userId, isUsed: false });

  // Generate secure token
  const token = require('crypto').randomBytes(32).toString('hex');

  // Create new token (expires in 24 hours)
  const verificationToken = new this({
    userId,
    email,
    token,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  return await verificationToken.save();
};

// Static method to verify token
EmailVerificationSchema.statics.verifyToken = async function (
  token: string,
): Promise<EmailVerificationDocument | null> {
  return await this.findOne({
    token,
    isUsed: false,
    expiresAt: { $gt: new Date() },
  });
};

// Static method to cleanup expired tokens
EmailVerificationSchema.statics.cleanupExpiredTokens = async function (): Promise<void> {
  await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isUsed: true, createdAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }, // Delete used tokens older than 7 days
    ],
  });
};

export const EmailVerification = mongoose.model<EmailVerificationDocument, EmailVerificationModel>(
  'EmailVerification',
  EmailVerificationSchema,
);
