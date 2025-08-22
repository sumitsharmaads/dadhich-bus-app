import mongoose, { Document, Model, Schema } from 'mongoose';

export interface TotpSecretDocument extends Document {
  userId: mongoose.Types.ObjectId;
  secretEnc: string;
  iv: string;
  tag: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TotpSecretModel extends Model<TotpSecretDocument> {}

const TotpSecretSchema = new Schema<TotpSecretDocument, TotpSecretModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    secretEnc: { type: String, required: true },
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    enabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const TotpSecret = mongoose.model<TotpSecretDocument, TotpSecretModel>(
  'TotpSecret',
  TotpSecretSchema,
);
