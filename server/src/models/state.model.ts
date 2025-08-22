import mongoose, { Document, Model, Schema } from 'mongoose';

export interface StateDocument extends Document {
  name: string;
  code?: string;
  slug: string;
  countryId: mongoose.Types.ObjectId;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StateModel extends Model<StateDocument> {}

const StateSchema = new Schema<StateDocument, StateModel>(
  {
    name: { type: String, required: true, index: true },
    code: { type: String },
    slug: { type: String, required: true, unique: true, index: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const State = mongoose.model<StateDocument, StateModel>('State', StateSchema);
