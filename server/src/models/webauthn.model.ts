import mongoose, { Document, Model, Schema } from 'mongoose';

export interface WebAuthnCredentialDocument extends Document {
  userId: mongoose.Types.ObjectId;
  credentialId: string; // base64url
  publicKey: string; // base64url
  counter: number;
  transports?: string[];
  deviceType?: 'singleDevice' | 'multiDevice';
  backedUp?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebAuthnCredentialModel extends Model<WebAuthnCredentialDocument> {}

const WebAuthnCredentialSchema = new Schema<WebAuthnCredentialDocument, WebAuthnCredentialModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    credentialId: { type: String, required: true, unique: true, index: true },
    publicKey: { type: String, required: true },
    counter: { type: Number, default: 0 },
    transports: { type: [String], default: [] },
    deviceType: { type: String },
    backedUp: { type: Boolean },
  },
  { timestamps: true },
);

export const WebAuthnCredential = mongoose.model<
  WebAuthnCredentialDocument,
  WebAuthnCredentialModel
>('WebAuthnCredential', WebAuthnCredentialSchema);
