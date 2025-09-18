import mongoose, { Document, Model, Schema } from 'mongoose';

export interface PasswordHistoryDocument extends Document {
  userId: mongoose.Types.ObjectId;
  passwordHash: string;
  createdAt: Date;
}

export interface PasswordHistoryModel extends Model<PasswordHistoryDocument> {}

const PasswordHistorySchema = new Schema<PasswordHistoryDocument, PasswordHistoryModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
PasswordHistorySchema.index({ userId: 1, createdAt: -1 });

// TTL index to automatically delete old password history after 1 year
PasswordHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const PasswordHistory = mongoose.model<PasswordHistoryDocument, PasswordHistoryModel>(
  'PasswordHistory',
  PasswordHistorySchema,
);
