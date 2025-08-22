export type TokenType = {
  accessToken: string;
};

export type AddUpRequestTypes = {
  setLoading?: (status: boolean) => void;
  showSuccess?: boolean;
  successMessage?: string;
};

export type ErrorResponse = {
  success: false;
  status: 400 | 401 | 403 | 404 | 500;
  message: string;
  errors?: Record<string, string[]>;
};

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  result?: T; // Some APIs return 'result' instead of 'data'
};

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tour related types
export interface Tour {
  _id: string;
  tourname: string;
  startDate: string;
  endDate: string;
  days: number;
  night: number;
  duration: string;
  price: number;
  description: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: DayPlan[];
  image: {
    id: string;
    url: string;
  };
  gallery: Array<{
    id: string;
    url: string;
  }>;
  places: string[];
  maxCapacity: number;
  currentBookings: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Admin Tour creation types moved to tour.types.ts

export interface DayPlan {
  day: number;
  title: string;
  description: string;
  places: string[];
  meals: string[];
  accommodation?: string;
}

// Booking related types
export interface Booking {
  _id: string;
  tourId: string;
  userId: string;
  passengerDetails: PassengerDetail[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  bookingStatus: "confirmed" | "cancelled" | "completed";
  bookingDate: string;
  specialRequests?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface PassengerDetail {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  idType: "aadhar" | "passport" | "driving_license";
  idNumber: string;
}

// Contact/Inquiry types
export interface ContactInquiry {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: "general" | "tour_inquiry" | "booking_support" | "complaint";
  status: "pending" | "in_progress" | "resolved" | "closed";
  createdAt: string;
}

// Places/Destinations types
export interface Place {
  _id: string;
  name: string;
  state: string;
  country: string;
  description: string;
  images: Array<{
    id: string;
    url: string;
  }>;
  attractions: string[];
  bestTimeToVisit: string;
  isActive: boolean;
}

// Blog/Article types
export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: {
    id: string;
    url: string;
  };
  author: string;
  tags: string[];
  category: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
