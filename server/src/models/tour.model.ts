import mongoose, { Document, Model, Schema } from 'mongoose';

export type TourStatus = 'draft' | 'published';

export interface TourSourceItem {
  cityId: mongoose.Types.ObjectId; // ref City
  cityName?: string;
  fare: number;
  onBoarding?: string[];
  departureTime?: string;
  arrivalTime?: string;
}

export interface TourPlaceItem {
  cityId: mongoose.Types.ObjectId; // ref City
  name?: string;
  state?: string;
  order?: number;
  stayDuration?: number; // in hours
  activities?: string[];
}

export interface TourItineraryItem {
  title: string;
  shortDescription?: string;
  toggles?: string[];
  sightseeing?: string[];
  order?: number;
  day?: number;
  duration?: string;
  meals?: string[];
  accommodation?: string;
  transportation?: string;
  highlights?: string[];
  notes?: string;
}

export interface TourStayItem {
  nights?: number;
  place?: string;
  accommodation?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface TourDiscount {
  type: 'percent' | 'amount';
  value: number; // percent (0-100) or absolute amount in pricing currency
  validFrom?: Date;
  validTo?: Date;
  minAmount?: number;
  maxDiscount?: number;
  applicableOn?: string; // 'total', 'fare', 'accommodation'
}

export interface TourGroupDiscount {
  minMembers: number;
  maxMembers?: number;
  type: 'percent' | 'amount';
  value: number;
  applicableOn?: string;
  description?: string;
}

export interface TourPricing {
  minFare: number;
  maxFare?: number;
  currencyCode: string;
  adultPrice?: number;
  childPrice?: number;
  infantPrice?: number;
  singleSupplement?: number;
  taxes?: number;
  serviceCharge?: number;
}

export interface TourDocument extends Document {
  tourName: string;
  description?: string;
  shortDescription?: string;
  highlights?: string[];
  sources: TourSourceItem[];
  places: TourPlaceItem[];
  heroImage?: { url?: string; id?: string };
  gallery?: { url?: string; id?: string; caption?: string }[];
  startDate: Date;
  endDate: Date;
  duration?: string;
  days?: number;
  nights?: number;
  stayDescription?: TourStayItem[];
  busId?: mongoose.Types.ObjectId; // ref Bus
  captainUserId?: mongoose.Types.ObjectId; // ref User
  inclusive: string[];
  exclusive?: string[];
  type: string[]; // e.g., ['family', 'adventure']
  category?: string; // 'domestic', 'international', 'pilgrimage', 'adventure'
  capacity: number;
  minCapacity?: number;
  maxCapacity?: number;
  itinerary?: TourItineraryItem[];
  pricing: TourPricing;
  // Discounts (optional)
  discount?: TourDiscount;
  groupDiscounts?: TourGroupDiscount[];
  // Additional features
  difficulty?: 'easy' | 'moderate' | 'difficult';
  ageGroup?: string[];
  fitnessLevel?: string;
  specialRequirements?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  // SEO
  seo?: { title?: string; description?: string; keywords?: string[] };
  seoRoutePath?: string; // optional link to global SEO entry
  status: TourStatus;
  isActive: boolean;
  isDeleted: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TourModel extends Model<TourDocument> {}

const SourceItemSchema = new Schema<TourSourceItem>(
  {
    cityId: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    cityName: String,
    fare: { type: Number, required: true },
    onBoarding: { type: [String], default: [] },
    departureTime: String,
    arrivalTime: String,
  },
  { _id: false },
);

const PlaceItemSchema = new Schema<TourPlaceItem>(
  {
    cityId: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    name: String,
    state: String,
    order: Number,
    stayDuration: Number,
    activities: { type: [String], default: [] },
  },
  { _id: false },
);

const ItinerarySchema = new Schema<TourItineraryItem>(
  {
    title: { type: String, required: true },
    shortDescription: String,
    toggles: { type: [String], default: [] },
    sightseeing: { type: [String], default: [] },
    order: Number,
    day: Number,
    duration: String,
    meals: { type: [String], default: [] },
    accommodation: String,
    transportation: String,
    highlights: { type: [String], default: [] },
    notes: String,
  },
  { _id: false },
);

const StaySchema = new Schema<TourStayItem>(
  {
    nights: Number,
    place: String,
    accommodation: String,
    checkIn: String,
    checkOut: String,
  },
  { _id: false },
);

const DiscountSchema = new Schema<TourDiscount>(
  {
    type: { type: String, enum: ['percent', 'amount'], required: true },
    value: { type: Number, required: true },
    validFrom: Date,
    validTo: Date,
    minAmount: Number,
    maxDiscount: Number,
    applicableOn: String,
  },
  { _id: false },
);

const GroupDiscountSchema = new Schema<TourGroupDiscount>(
  {
    minMembers: { type: Number, required: true },
    maxMembers: Number,
    type: { type: String, enum: ['percent', 'amount'], required: true },
    value: { type: Number, required: true },
    applicableOn: String,
    description: String,
  },
  { _id: false },
);

// const PricingSchema = new Schema<TourPricing>(
//   {
//     minFare: { type: Number, required: true },
//     maxFare: Number,
//     currencyCode: { type: String, default: 'INR' },
//     adultPrice: Number,
//     childPrice: Number,
//     infantPrice: Number,
//     singleSupplement: Number,
//     taxes: Number,
//     serviceCharge: Number,
//   },
//   { _id: false },
// );

const TourSchema = new Schema<TourDocument, TourModel>(
  {
    tourName: { type: String, required: true, index: true },
    description: String,
    shortDescription: String,
    highlights: { type: [String], default: [] },
    sources: { type: [SourceItemSchema], required: true },
    places: { type: [PlaceItemSchema], required: true },
    heroImage: { url: String, id: String },
    gallery: [{ url: String, id: String, caption: String }],
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    duration: String,
    days: Number,
    nights: Number,
    stayDescription: { type: [StaySchema], default: [] },
    busId: { type: Schema.Types.ObjectId, ref: 'Bus' },
    captainUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    inclusive: { type: [String], required: true },
    exclusive: { type: [String], default: [] },
    type: { type: [String], required: true },
    category: String,
    capacity: { type: Number, required: true },
    minCapacity: Number,
    maxCapacity: Number,
    itinerary: { type: [ItinerarySchema], default: [] },
    pricing: {
      minFare: { type: Number, required: true },
      maxFare: Number,
      currencyCode: { type: String, default: 'INR' },
      adultPrice: Number,
      childPrice: Number,
      infantPrice: Number,
      singleSupplement: Number,
      taxes: Number,
      serviceCharge: Number,
    },
    discount: { type: DiscountSchema, required: false },
    groupDiscounts: { type: [GroupDiscountSchema], default: [] },
    difficulty: { type: String, enum: ['easy', 'moderate', 'difficult'] },
    ageGroup: { type: [String], default: [] },
    fitnessLevel: String,
    specialRequirements: { type: [String], default: [] },
    cancellationPolicy: String,
    refundPolicy: String,
    seo: {
      title: String,
      description: String,
      keywords: { type: [String], default: [] },
    },
    seoRoutePath: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

TourSchema.index({ 'places.cityId': 1 });
TourSchema.index({ 'sources.cityId': 1 });
TourSchema.index({ 'pricing.minFare': 1 });
TourSchema.index({ nights: 1 });
TourSchema.index({ type: 1 });
TourSchema.index({ category: 1 });
TourSchema.index({ difficulty: 1 });
TourSchema.index({ isFeatured: 1 });
TourSchema.index({ rating: 1 });
// Text index for search
TourSchema.index({ tourName: 'text', description: 'text', shortDescription: 'text' });

export const Tour = mongoose.model<TourDocument, TourModel>('Tour', TourSchema);
