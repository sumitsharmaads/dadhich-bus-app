import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CountryDocument extends Document {
  name: string;
  code: string; // ISO-3166 alpha-2 or alpha-3
  slug: string;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CountryModel extends Model<CountryDocument> {}

const CountrySchema = new Schema<CountryDocument, CountryModel>(
  {
    name: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    slug: { type: String, required: true, unique: true, index: true },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const Country = mongoose.model<CountryDocument, CountryModel>('Country', CountrySchema);
