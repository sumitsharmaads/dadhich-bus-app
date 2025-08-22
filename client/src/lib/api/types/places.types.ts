export interface Country {
  _id: string;
  name: string;
  code: string;
  slug: string;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  _id: string;
  name: string;
  code?: string;
  slug: string;
  countryId: string;
  country?: Country;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  _id: string;
  name: string;
  slug: string;
  countryId: string;
  stateId: {
    _id: string;
    name: string;
    code: string;
  };
  country?: Country;
  state?: State;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  visitInfo?: {
    bestTime?: string;
    averageVisitDurationMins?: number;
    openingHours?: {
      day: number;
      open?: string;
      close?: string;
      closed?: boolean;
    }[];
    entryFees?: {
      currencyCode?: string;
      amount?: number;
    }[];
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
      nearestAirportId?: string;
      nearestStationId?: string;
      nearestBusId?: string;
      notes?: string;
    };
    pickupDropPoints?: {
      name?: string;
      location?: {
        type: "Point";
        coordinates: [number, number];
      };
    }[];
  };
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request interfaces
export interface CreateCountryRequest {
  name: string;
  code: string;
  slug?: string;
  isPublished?: boolean;
}

export interface UpdateCountryRequest extends Partial<CreateCountryRequest> {}

export interface CreateStateRequest {
  name: string;
  code?: string;
  slug?: string;
  countryId: string;
  isPublished?: boolean;
}

export interface UpdateStateRequest extends Partial<CreateStateRequest> {}

export interface CreateCityRequest {
  name: string;
  slug?: string;
  countryId: string;
  stateId: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  visitInfo?: {
    bestTime?: string;
    averageVisitDurationMins?: number;
    openingHours?: {
      day: number;
      open?: string;
      close?: string;
      closed?: boolean;
    }[];
    entryFees?: {
      currencyCode?: string;
      amount?: number;
    }[];
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
      nearestAirportId?: string;
      nearestStationId?: string;
      nearestBusId?: string;
      notes?: string;
    };
    pickupDropPoints?: {
      name?: string;
      location?: {
        type: "Point";
        coordinates: [number, number];
      };
    }[];
  };
  isPublished?: boolean;
}

export interface UpdateCityRequest extends Partial<CreateCityRequest> {}

// Filter interfaces
export interface CityFilter {
  name?: string;
  countryId?: string;
  stateId?: string;
  isPublished?: boolean;
  tags?: string[];
  categories?: string[];
}

export interface StateFilter {
  name?: string;
  countryId?: string;
  isPublished?: boolean;
}

export interface CountryFilter {
  name?: string;
  code?: string;
  isPublished?: boolean;
}

// Response interfaces
export interface PlacesListResponse<T> {
  success: boolean;
  data: T[];
  message: string;
}

export interface PlacesSingleResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PlacesStatsResponse {
  success: boolean;
  data: {
    totalCountries: number;
    totalStates: number;
    totalCities: number;
    publishedCountries: number;
    publishedStates: number;
    publishedCities: number;
  };
  message: string;
}

// Legacy interface for backward compatibility
export interface LegacyPlace {
  _id?: string;
  id?: number;
  state: string;
  name: string;
  accentcity?: string;
  latitude?: string;
  longitude?: string;
}
