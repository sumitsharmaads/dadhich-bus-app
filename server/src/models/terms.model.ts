import mongoose, { Document, Model, Schema } from 'mongoose';

export interface TermsDocument extends Document {
  title?: string;
  slug?: string;
  text: string;
  version: number;
  isCurrent: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TermsModel extends Model<TermsDocument> {}

const TermsSchema = new Schema<TermsDocument, TermsModel>(
  {
    title: { type: String },
    slug: { type: String, index: true },
    text: { type: String, required: true },
    version: { type: Number, required: true, index: true },
    isCurrent: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

TermsSchema.pre('validate', async function (next) {
  if (this.isNew && (this.version === undefined || this.version === null)) {
    const latest = await Terms.findOne().sort({ version: -1 }).select('version').lean();
    this.version = latest ? latest.version + 1 : 1;
  }
  next();
});

export const Terms = mongoose.model<TermsDocument, TermsModel>('Terms', TermsSchema);
