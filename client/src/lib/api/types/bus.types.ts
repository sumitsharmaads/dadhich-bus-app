// Bus-related API types

export interface Bus {
  _id: string;
  name: string;
  registrationNumber: string;
  capacity: number;
  totalSeats?: number;
  type: BusType;
  ac: boolean;
  amenities?: string[];
  images?: BusImage[];
  operator?: BusOperator;
  seatLayout?: BusSeatLayout;
  notes?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusImage {
  url?: string;
  id?: string;
  caption?: string;
}

export interface BusOperator {
  name?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface BusSeatLayout {
  rows?: number;
  cols?: number;
  layout?: SeatLayoutCell[];
}

export interface SeatLayoutCell {
  row: number;
  col: number;
  type?: "seat" | "berth" | "aisle" | "empty";
  code?: string;
}

export interface CreateBusData {
  name: string;
  registrationNumber: string;
  capacity: number;
  totalSeats?: number;
  type?: BusType;
  ac?: boolean;
  amenities?: string[];
  images?: BusImage[];
  operator?: BusOperator;
  seatLayout?: BusSeatLayout;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateBusData {
  name?: string;
  registrationNumber?: string;
  capacity?: number;
  totalSeats?: number;
  type?: BusType;
  ac?: boolean;
  amenities?: string[];
  images?: BusImage[];
  operator?: BusOperator;
  seatLayout?: BusSeatLayout;
  notes?: string;
  isActive?: boolean;
}

export interface BusListCondition {
  q?: string;
  type?: BusType;
  isActive?: boolean;
  page?: number;
  items?: number;
}

export interface IRBusListResponse {
  success: boolean;
  data: BusListResponse;
  message: string;
}
export interface BusListResponse {
  buses: Bus[];
  pagination: {
    page: number;
    items: number;
    total: number;
    totalPages: number;
  };
}

export interface BusStats {
  totalBuses: number;
  activeBuses: number;
  inactiveBuses: number;
  seaterBuses: number;
  sleeperBuses: number;
  mixedBuses: number;
  acBuses: number;
  nonAcBuses: number;
}

export interface BulkUpdateData {
  busIds: string[];
  updates: UpdateBusData;
}

export interface BulkDeleteData {
  busIds: string[];
}

export interface BusStatusUpdate {
  isActive: boolean;
}

export interface SeatLayoutUpdate {
  seatLayout: {
    rows: number;
    cols: number;
    layout: SeatLayoutCell[];
  };
}

// Enums
export enum BusType {
  SEATER = "seater",
  SLEEPER = "sleeper",
  MIXED = "mixed",
}

export enum SeatType {
  SEAT = "seat",
  BERTH = "berth",
  AISLE = "aisle",
  EMPTY = "empty",
}

// Amenities constants
export const BUS_AMENITIES = [
  "wifi",
  "charging",
  "blanket",
  "water",
  "tv",
  "music",
  "gps",
  "toilet",
  "snacks",
  "beverages",
] as const;

export type BusAmenity = (typeof BUS_AMENITIES)[number];

// API Response types
export interface CreateBusResponse {
  _id: string;
  name: string;
  registrationNumber: string;
}

export interface GetBusResponse {
  data: Bus;
}

export interface GetBusStatsResponse {
  data: BusStats;
}

export interface GetSeatLayoutResponse {
  data: BusSeatLayout;
}
