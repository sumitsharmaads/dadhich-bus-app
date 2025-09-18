import mongoose, { Document, Model, Schema } from 'mongoose';

export interface SeoDocument extends Document {
  routePath: string; // e.g., "/about", "/"
  pageName?: string;

  // Basic Meta Tags (Route-specific)
  meta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };

  // Open Graph (Route-specific)
  openGraph?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageAlt?: string;
  };

  // Twitter Cards (Route-specific)
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    imageUrl?: string;
  };

  // Technical SEO (Route-specific)
  canonicalUrl?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
  };

  // Structured Data (Route-specific)
  structuredData?: Record<string, unknown> | null; // JSON-LD

  // Content Optimization (Route-specific)
  contentOptimization?: {
    focusKeyword?: string;
    secondaryKeywords?: string[];
    contentLength?: number;
    readabilityScore?: number;
    internalLinks?: string[];
    externalLinks?: string[];
  };

  // Publishing Control
  isPublished: boolean;
  isDeleted: boolean;
  priority?: number; // 0-1 for sitemap priority
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastModified?: Date;

  // Audit Trail
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface SeoModel extends Model<SeoDocument> {}

const SeoSchema = new Schema<SeoDocument, SeoModel>(
  {
    routePath: { type: String, required: true, unique: true, index: true },
    pageName: { type: String },

    // Basic Meta Tags (Route-specific)
    meta: {
      title: String,
      description: String,
      keywords: { type: [String], default: [] },
    },

    // Open Graph (Route-specific)
    openGraph: {
      title: String,
      description: String,
      imageUrl: String,
      imageWidth: Number,
      imageHeight: Number,
      imageAlt: String,
    },

    // Twitter Cards (Route-specific)
    twitter: {
      card: { type: String, enum: ['summary', 'summary_large_image', 'app', 'player'] },
      title: String,
      description: String,
      imageUrl: String,
    },

    // Technical SEO (Route-specific)
    canonicalUrl: String,
    robots: {
      noindex: { type: Boolean, default: false },
      nofollow: { type: Boolean, default: false },
      noarchive: { type: Boolean, default: false },
      nosnippet: { type: Boolean, default: false },
      noimageindex: { type: Boolean, default: false },
      maxSnippet: Number,
      maxImagePreview: { type: String, enum: ['none', 'standard', 'large'] },
      maxVideoPreview: Number,
    },

    // Structured Data (Route-specific)
    structuredData: { type: Schema.Types.Mixed, default: null },

    // Content Optimization (Route-specific)
    contentOptimization: {
      focusKeyword: String,
      secondaryKeywords: [String],
      contentLength: Number,
      readabilityScore: Number,
      internalLinks: [String],
      externalLinks: [String],
    },

    // Publishing Control
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
    priority: { type: Number, min: 0, max: 1, default: 0.5 },
    changeFrequency: {
      type: String,
      enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
      default: 'monthly',
    },
    lastModified: { type: Date, default: Date.now },

    // Audit Trail
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true },
);

export const Seo = mongoose.model<SeoDocument, SeoModel>('Seo', SeoSchema);
