import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SeoDocument extends Document {
  routePath: string; // e.g., "/about", "/"
  pageName?: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  openGraph?: {
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    imageUrl?: string;
  };
  canonicalUrl?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
  };
  structuredData?: Record<string, unknown> | null; // JSON-LD
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeoModel extends Model<SeoDocument> {}

const SeoSchema = new Schema<SeoDocument, SeoModel>(
  {
    routePath: { type: String, required: true, unique: true, index: true },
    pageName: { type: String },
    meta: {
      title: String,
      description: String,
      keywords: { type: [String], default: [] },
    },
    openGraph: {
      title: String,
      description: String,
      imageUrl: String,
    },
    twitter: {
      card: { type: String, enum: ['summary', 'summary_large_image', 'app', 'player'] },
      title: String,
      description: String,
      imageUrl: String,
    },
    canonicalUrl: String,
    robots: {
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
    },
    structuredData: { type: Schema.Types.Mixed, default: null },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const Seo = mongoose.model<SeoDocument, SeoModel>('Seo', SeoSchema);
