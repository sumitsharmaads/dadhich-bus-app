import mongoose, { Document, Model, Schema } from 'mongoose';

export interface AccountLockoutDocument extends Document {
  email: string;
  failedAttempts: number;
  lockedUntil?: Date;
  lastAttemptAt: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountLockoutModel extends Model<AccountLockoutDocument> {
  recordFailedAttempt(email: string, ipAddress?: string, userAgent?: string): Promise<void>;
  resetFailedAttempts(email: string): Promise<void>;
  isAccountLocked(email: string): Promise<boolean>;
  getRemainingLockTime(email: string): Promise<number>;
}

const AccountLockoutSchema = new Schema<AccountLockoutDocument, AccountLockoutModel>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    lastAttemptAt: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Static method to record failed attempt
AccountLockoutSchema.statics.recordFailedAttempt = async function (
  email: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<void> {
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MINUTES = 15; // 15 minutes lockout

  const lockout = await this.findOne({ email });

  if (!lockout) {
    // Create new lockout record
    await this.create({
      email,
      failedAttempts: 1,
      lastAttemptAt: new Date(),
      ipAddress,
      userAgent,
    });
  } else {
    // Update existing record
    lockout.failedAttempts += 1;
    lockout.lastAttemptAt = new Date();
    lockout.ipAddress = ipAddress;
    lockout.userAgent = userAgent;

    // Lock account if max attempts reached
    if (lockout.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      lockout.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000);
    }

    await lockout.save();
  }
};

// Static method to reset failed attempts
AccountLockoutSchema.statics.resetFailedAttempts = async function (email: string): Promise<void> {
  await this.deleteOne({ email });
};

// Static method to check if account is locked
AccountLockoutSchema.statics.isAccountLocked = async function (email: string): Promise<boolean> {
  const lockout = await this.findOne({ email });

  if (!lockout || !lockout.lockedUntil) {
    return false;
  }

  // If lockout has expired, remove the record
  if (lockout.lockedUntil < new Date()) {
    await this.deleteOne({ email });
    return false;
  }

  return true;
};

// Static method to get remaining lock time
AccountLockoutSchema.statics.getRemainingLockTime = async function (
  email: string,
): Promise<number> {
  const lockout = await this.findOne({ email });

  if (!lockout || !lockout.lockedUntil) {
    return 0;
  }

  const remaining = lockout.lockedUntil.getTime() - Date.now();
  return Math.max(0, Math.ceil(remaining / 1000)); // Return seconds
};

// TTL index to automatically clean up expired lockouts
AccountLockoutSchema.index({ lockedUntil: 1 }, { expireAfterSeconds: 0 });

export const AccountLockout = mongoose.model<AccountLockoutDocument, AccountLockoutModel>(
  'AccountLockout',
  AccountLockoutSchema,
);
