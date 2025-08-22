export interface CustomTourPlanningRequest {
  name: string;
  email?: string;
  phone: string;
  from: string;
  departureDate?: string;
  days?: string;
  adults?: string;
  children?: string;
  message?: string;
}

export interface InquiryResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface TourInquiryRequest {
  name: string;
  email: string;
  phone?: string;
  tourId: string;
  tourName: string;
  route: string;
  approxDate?: string;
  passengers?: number;
  message?: string;
}

export interface HelpWidgetRequest {
  name: string;
  email: string;
  phone: string;
  adults: string;
  children: string;
  destination: string;
}

export interface GeneralInquiryRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface LocalBusRentalRequest {
  name: string;
  email: string;
  phone: string;
  city: string;
  date: string;
  hours: number;
  passengers: number;
  notes?: string;
}

export interface OutstationBusRentalRequest {
  name: string;
  email: string;
  phone: string;
  fromCity: string;
  toCity: string;
  startDate: string;
  endDate: string;
  passengers: number;
  notes?: string;
}
