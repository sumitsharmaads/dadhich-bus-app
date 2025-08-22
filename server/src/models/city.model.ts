import mongoose, { Document, Model, Schema } from 'mongoose';

export interface CityDocument extends Document {
  name: string;
  slug: string;
  countryId: mongoose.Types.ObjectId;
  stateId: mongoose.Types.ObjectId;
  location?: { type: 'Point'; coordinates: [number, number] };
  visitInfo?: {
    bestTime?: string;
    averageVisitDurationMins?: number;
    openingHours?: { day: number; open?: string; close?: string; closed?: boolean }[];
    entryFees?: { currencyCode?: string; amount?: number }[];
    amenities?: string[];
    safetyNotes?: string;
  };
  content?: {
    description?: string;
    longDescription?: string;
    tags?: string[];
    categories?: string[];
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      metaKeywords?: string[];
      ogImageUrl?: string;
    };
  };
  travel?: {
    howToReach?: {
      nearestAirportId?: mongoose.Types.ObjectId;
      nearestStationId?: mongoose.Types.ObjectId;
      nearestBusId?: mongoose.Types.ObjectId;
      notes?: string;
    };
    pickupDropPoints?: {
      name?: string;
      location?: { type: 'Point'; coordinates: [number, number] };
    }[];
  };
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CityModel extends Model<CityDocument> {}

const PointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: undefined }, // [lng, lat]
  },
  { _id: false },
);

const CitySchema = new Schema<CityDocument, CityModel>(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true, index: true },
    stateId: { type: Schema.Types.ObjectId, ref: 'State', required: true, index: true },
    location: PointSchema,
    visitInfo: {
      bestTime: String,
      averageVisitDurationMins: Number,
      openingHours: [
        {
          day: { type: Number, min: 0, max: 6 },
          open: String,
          close: String,
          closed: Boolean,
        },
      ],
      entryFees: [
        {
          currencyCode: String,
          amount: Number,
        },
      ],
      amenities: { type: [String], default: [] },
      safetyNotes: String,
    },
    content: {
      description: String,
      longDescription: String,
      tags: { type: [String], default: [] },
      categories: { type: [String], default: [] },
      seo: {
        metaTitle: String,
        metaDescription: String,
        metaKeywords: { type: [String], default: [] },
        ogImageUrl: String,
      },
    },
    travel: {
      howToReach: {
        nearestAirportId: { type: Schema.Types.ObjectId },
        nearestStationId: { type: Schema.Types.ObjectId },
        nearestBusId: { type: Schema.Types.ObjectId },
        notes: String,
      },
      pickupDropPoints: [
        {
          name: String,
          location: PointSchema,
        },
      ],
    },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

CitySchema.index({ location: '2dsphere' });

export const City = mongoose.model<CityDocument, CityModel>('City', CitySchema);
