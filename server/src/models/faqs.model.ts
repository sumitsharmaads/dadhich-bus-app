import mongoose, { Document, Model, Schema } from 'mongoose';

export interface FAQDocument extends Document {
  questions: Array<{
    question: string;
    answer: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQModel extends Model<FAQDocument> {}

const FAQSchema = new Schema<FAQDocument, FAQModel>(
  {
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const FAQ = mongoose.model<FAQDocument, FAQModel>('FAQ', FAQSchema);
