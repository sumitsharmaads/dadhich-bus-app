// Tour-related API types

export interface TourImage {
  id: string;
  url: string;
}

export interface TourPlace {
  cityId:
    | string
    | {
        _id: string;
        name: string;
      };
  name: string;
  state?: string;
  order?: number;
  stayDuration?: number;
  activities?: string[];
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

export interface TourDiscount {
  type: "percent" | "amount";
  value: number;
  validFrom?: string;
  validTo?: string;
  minAmount?: number;
  maxDiscount?: number;
  applicableOn?: string;
}

export interface TourGroupDiscount {
  minMembers: number;
  maxMembers?: number;
  type: "percent" | "amount";
  value: number;
  applicableOn?: string;
  description?: string;
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

export interface TourSourceItem {
  cityId:
    | string
    | {
        _id: string;
        name: string;
      };
  cityName?: string;
  fare: number;
  onBoarding?: string[];
  departureTime?: string;
  arrivalTime?: string;
}

export interface Tour {
  _id: string;
  tourName: string;
  description?: string;
  shortDescription?: string;
  highlights?: string[];
  sources: TourSourceItem[];
  places: TourPlace[];
  heroImage?: TourImage;
  gallery?: TourImage[];
  startDate: string;
  endDate: string;
  duration?: string;
  days?: number;
  nights?: number;
  stayDescription?: TourStayItem[];
  busId?: string;
  captainUserId?:
    | string
    | {
        _id: string;
        fullname: string;
        username: string;
      };
  inclusive: string[];
  exclusive?: string[];
  type: string[];
  category?: string;
  capacity: number;
  minCapacity?: number;
  maxCapacity?: number;
  itinerary?: TourItineraryItem[];
  pricing: TourPricing;
  discount?: TourDiscount;
  groupDiscounts?: TourGroupDiscount[];
  difficulty?: "easy" | "moderate" | "difficult";
  ageGroup?: string[];
  fitnessLevel?: string;
  specialRequirements?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  seoRoutePath?: string;
  status: "draft" | "published";
  isActive: boolean;
  isDeleted: boolean;
  isFeatured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ========== ADMIN TOUR TYPES ==========

export interface CreateTourRequest {
  tourName: string;
  description?: string;
  shortDescription?: string;
  highlights?: string[];
  sources: TourSourceItem[];
  places: TourPlace[];
  heroImage?: TourImage;
  gallery?: TourImage[];
  startDate: string;
  endDate: string;
  duration?: string;
  days?: number;
  nights?: number;
  stayDescription?: TourStayItem[];
  busId?: string;
  captainUserId?: string;
  inclusive: string[];
  exclusive?: string[];
  type: string[];
  category?: string;
  capacity: number;
  minCapacity?: number;
  maxCapacity?: number;
  itinerary?: TourItineraryItem[];
  pricing: TourPricing;
  discount?: TourDiscount;
  groupDiscounts?: TourGroupDiscount[];
  difficulty?: "easy" | "moderate" | "difficult";
  ageGroup?: string[];
  fitnessLevel?: string;
  specialRequirements?: string[];
  cancellationPolicy?: string;
  refundPolicy?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  seoRoutePath?: string;
  status: "draft" | "published";
  isActive: boolean;
  isFeatured?: boolean;
}

export interface UpdateTourRequest extends Partial<CreateTourRequest> {
  _id: string;
}

export interface AdminTourListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "draft" | "published" | "all";
  type?: string;
  sourceCity?: string;
  destinationCity?: string;
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AdminTourListResponse {
  success: boolean;
  data: {
    tours: Tour[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
}

export interface AdminTourStats {
  totalTours: number;
  publishedTours: number;
  draftTours: number;
  activeTours: number;
  totalCapacity: number;
  totalRevenue: number;
  upcomingTours: number;
  completedTours: number;
}

export interface AdminTourStatsResponse {
  success: boolean;
  data: AdminTourStats;
  message: string;
}

export interface BulkOperationRequest {
  tourIds: string[];
}

export interface BulkOperationResponse {
  success: boolean;
  message: string;
  data: {
    successCount: number;
    failedCount: number;
    failedIds: string[];
  };
}

export interface TourExportRequest {
  format: "csv" | "excel";
  filters?: AdminTourListParams;
}

export interface TourExportResponse {
  success: boolean;
  data: {
    downloadUrl: string;
    filename?: string;
    totalTours?: number;
    message?: string;
  };
  message: string;
}

export interface TourImportResponse {
  success: boolean;
  data: {
    totalRows: number;
    successCount: number;
    failedCount: number;
    errors: string[];
    results?: Array<{
      row: number;
      tourName: string;
      status: "success" | "error";
      tourId?: string;
      error?: string;
    }>;
  };
  message: string;
}

// ========== EXISTING TYPES ==========

export interface TourListItem {
  _id: string;
  tourName: string;
  description?: string;
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  heroImage?: TourImage;
  sources: TourSourceItem[];
  places: TourPlace[];
  pricing?: TourPricing;
  type?: string[];
  inclusive?: string[];
  capacity?: number;
  discount?: TourDiscount;
}

export interface TourSearchParams {
  q?: string;
  priceMin?: number;
  priceMax?: number;
  startDate?: string;
  endDate?: string;
  daysMin?: number;
  daysMax?: number;
  nightsMin?: number;
  nightsMax?: number;
  inclusive?: string;
  type?: string;
  sourceCity?: string;
  placeCity?: string;
  state?: string;
  capacity?: number;
  rating?: number;
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "duration_asc"
    | "duration_desc"
    | "date_asc"
    | "date_desc"
    | "popularity";
  page?: number;
  items?: number;
}

export interface TourSearchResponse {
  success: boolean;
  data: {
    tours: TourListItem[];
    total: number;
    page: number;
    items: number;
    totalPages: number;
  };
  message: string;
}

export interface UpcomingToursResponse {
  success: boolean;
  data: TourListItem[];
  message: string;
}

export interface TourPriceRange {
  success: boolean;
  data: {
    min: number;
    max: number;
  };
  message: string;
}

export interface TourFacets {
  cityCounts: Array<{
    _id: string;
    count: number;
    name: string;
    state?: string;
  }>;
  types: Array<{
    type: string;
    count: number;
  }>;
  inclusives: Array<{
    feature: string;
    count: number;
  }>;
  durationBuckets: Array<{
    range: string;
    count: number;
    minDays: number;
    maxDays: number;
  }>;
  priceBuckets: Array<{
    range: string;
    count: number;
    minPrice: number;
    maxPrice: number;
  }>;
  sourceCities: Array<{
    _id: string;
    count: number;
    name: string;
  }>;
}

export interface TourStats {
  totalTours: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgDuration: number;
  minDuration: number;
  maxDuration: number;
  totalCapacity: number;
  upcomingDepartures: number;
}

export interface StateBreakupItem {
  state: string;
  count: number;
}

export interface StateBreakupResponse {
  success: boolean;
  data: StateBreakupItem[];
  message: string;
}

// For TopDestinations component
export interface DestinationData {
  name: string;
  listings: number;
  image: string;
  state: string;
}
