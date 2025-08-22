import { get, post, put, del } from "@/lib/service";
import {
  Country,
  State,
  City,
  CreateCountryRequest,
  UpdateCountryRequest,
  CreateStateRequest,
  UpdateStateRequest,
  CreateCityRequest,
  UpdateCityRequest,
  CityFilter,
  StateFilter,
  CountryFilter,
  PlacesListResponse,
  PlacesSingleResponse,
  PlacesStatsResponse,
  LegacyPlace,
} from "@/lib/api/types/places.types";

/**
 * Places service for managing countries, states, and cities
 */
export const placesService = {
  // ===== COUNTRIES =====

  // Get all countries
  listCountries: async (filter?: CountryFilter): Promise<Country[]> => {
    const params = filter ? { ...filter } : {};
    const response = await get<PlacesListResponse<Country>>(
      "/places/countries",
      { params }
    );
    return response.data?.data || [];
  },

  // Get country by ID
  getCountryById: async (id: string): Promise<Country> => {
    const response = await get<PlacesSingleResponse<Country>>(
      `/places/countries/${id}`
    );
    return response.data?.data;
  },

  // Create new country
  createCountry: async (data: CreateCountryRequest): Promise<Country> => {
    const response = await post<PlacesSingleResponse<Country>>(
      "/places/countries",
      data
    );
    return response.data?.data;
  },

  // Update existing country
  updateCountry: async (
    id: string,
    data: UpdateCountryRequest
  ): Promise<Country> => {
    const response = await put<PlacesSingleResponse<Country>>(
      `/places/countries/${id}`,
      data
    );
    return response.data?.data;
  },

  // Delete country
  deleteCountry: async (id: string): Promise<void> => {
    await del(`/places/countries/${id}`);
  },

  // Toggle country published status
  toggleCountryPublished: async (
    id: string,
    currentStatus: boolean
  ): Promise<Country> => {
    return placesService.updateCountry(id, { isPublished: !currentStatus });
  },

  // ===== STATES =====

  // Get all states
  listStates: async (filter?: StateFilter): Promise<State[]> => {
    const params = filter ? { ...filter } : {};
    const response = await get<PlacesListResponse<State>>("/places/states", {
      params,
    });
    return response.data?.data || [];
  },

  // Get states by country
  getStatesByCountry: async (countryId: string): Promise<State[]> => {
    const response = await get<PlacesListResponse<State>>("/places/states", {
      params: { countryId },
    });
    return response.data?.data || [];
  },

  // Get state by ID
  getStateById: async (id: string): Promise<State> => {
    const response = await get<PlacesSingleResponse<State>>(
      `/places/states/${id}`
    );
    return response.data?.data;
  },

  // Create new state
  createState: async (data: CreateStateRequest): Promise<State> => {
    const response = await post<PlacesSingleResponse<State>>(
      "/places/states",
      data
    );
    return response.data?.data;
  },

  // Update existing state
  updateState: async (id: string, data: UpdateStateRequest): Promise<State> => {
    const response = await put<PlacesSingleResponse<State>>(
      `/places/states/${id}`,
      data
    );
    return response.data?.data;
  },

  // Delete state
  deleteState: async (id: string): Promise<void> => {
    await del(`/places/states/${id}`);
  },

  // Toggle state published status
  toggleStatePublished: async (
    id: string,
    currentStatus: boolean
  ): Promise<State> => {
    return placesService.updateState(id, { isPublished: !currentStatus });
  },

  // ===== CITIES =====

  // Get all cities
  listCities: async (filter?: CityFilter): Promise<City[]> => {
    const params = filter ? { ...filter } : {};
    const response = await get<PlacesListResponse<City>>("/places/cities", {
      params,
    });
    return response.data?.data || [];
  },

  // Get cities by state
  getCitiesByState: async (stateId: string): Promise<City[]> => {
    const response = await get<PlacesListResponse<City>>("/places/cities", {
      params: { stateId },
    });
    return response.data?.data || [];
  },

  // Get cities by country
  getCitiesByCountry: async (countryId: string): Promise<City[]> => {
    const response = await get<PlacesListResponse<City>>("/places/cities", {
      params: { countryId },
    });
    return response.data?.data || [];
  },

  // Get city by ID
  getCityById: async (id: string): Promise<City> => {
    const response = await get<PlacesSingleResponse<City>>(
      `/places/cities/${id}`
    );
    return response.data?.data;
  },

  // Create new city
  createCity: async (data: CreateCityRequest): Promise<City> => {
    const response = await post<PlacesSingleResponse<City>>(
      "/places/cities",
      data
    );
    return response.data?.data;
  },

  // Update existing city
  updateCity: async (id: string, data: UpdateCityRequest): Promise<City> => {
    const response = await put<PlacesSingleResponse<City>>(
      `/places/cities/${id}`,
      data
    );
    return response.data?.data;
  },

  // Delete city
  deleteCity: async (id: string): Promise<void> => {
    await del(`/places/cities/${id}`);
  },

  // Toggle city published status
  toggleCityPublished: async (
    id: string,
    currentStatus: boolean
  ): Promise<City> => {
    return placesService.updateCity(id, { isPublished: !currentStatus });
  },

  // ===== LEGACY SUPPORT =====

  // Legacy method for backward compatibility
  listLegacyPlaces: async (condition: any): Promise<LegacyPlace[]> => {
    const response = await post<{
      data: { count: number; result: LegacyPlace[] };
    }>("places/admin/getAll", { condition });
    return response.data?.data?.result || [];
  },

  // Legacy create place
  createLegacyPlace: async (data: LegacyPlace): Promise<LegacyPlace> => {
    const response = await post<{ data: LegacyPlace }>("/places/add", data);
    return response.data?.data;
  },

  // Legacy update place
  updateLegacyPlace: async (
    id: string,
    data: Partial<LegacyPlace>
  ): Promise<LegacyPlace> => {
    const response = await put<{ data: LegacyPlace }>(`/places/${id}`, data);
    return response.data?.data;
  },

  // ===== BULK OPERATIONS =====

  // Bulk upload cities (legacy)
  bulkUploadCities: async (
    places: LegacyPlace[]
  ): Promise<{ skippedRecords: LegacyPlace[] }> => {
    const response = await post<{ data: { skippedRecords: LegacyPlace[] } }>(
      "places/upload",
      { places }
    );
    return response.data?.data;
  },

  // ===== MODERN BULK OPERATIONS =====

  // Bulk upload cities from Excel file using modern API
  bulkUploadCitiesFromFile: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await post<any>("/places/cities/bulk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Download bulk upload template using modern API
  downloadBulkTemplate: async (): Promise<void> => {
    const response = await get("/places/cities/bulk/template", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data as BlobPart])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "city_bulk_template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // ===== STATISTICS =====

  // Get places statistics
  getPlacesStats: async (): Promise<{
    totalCountries: number;
    totalStates: number;
    totalCities: number;
    publishedCountries: number;
    publishedStates: number;
    publishedCities: number;
  }> => {
    const response = await get<PlacesStatsResponse>("/places/stats");
    return (
      response.data?.data || {
        totalCountries: 0,
        totalStates: 0,
        totalCities: 0,
        publishedCountries: 0,
        publishedStates: 0,
        publishedCities: 0,
      }
    );
  },

  // ===== UTILITY METHODS =====

  // Generate slug from name
  generateSlug: (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  },

  // Get common Indian states (for quick setup)
  getCommonIndianStates: (): Array<{ name: string; code: string }> => [
    { name: "Andhra Pradesh", code: "AP" },
    { name: "Arunachal Pradesh", code: "AR" },
    { name: "Assam", code: "AS" },
    { name: "Bihar", code: "BR" },
    { name: "Chhattisgarh", code: "CG" },
    { name: "Goa", code: "GA" },
    { name: "Gujarat", code: "GJ" },
    { name: "Haryana", code: "HR" },
    { name: "Himachal Pradesh", code: "HP" },
    { name: "Jharkhand", code: "JH" },
    { name: "Karnataka", code: "KA" },
    { name: "Kerala", code: "KL" },
    { name: "Madhya Pradesh", code: "MP" },
    { name: "Maharashtra", code: "MH" },
    { name: "Manipur", code: "MN" },
    { name: "Meghalaya", code: "ML" },
    { name: "Mizoram", code: "MZ" },
    { name: "Nagaland", code: "NL" },
    { name: "Odisha", code: "OR" },
    { name: "Punjab", code: "PB" },
    { name: "Rajasthan", code: "RJ" },
    { name: "Sikkim", code: "SK" },
    { name: "Tamil Nadu", code: "TN" },
    { name: "Telangana", code: "TG" },
    { name: "Tripura", code: "TR" },
    { name: "Uttar Pradesh", code: "UP" },
    { name: "Uttarakhand", code: "UK" },
    { name: "West Bengal", code: "WB" },
    { name: "Andaman and Nicobar Islands", code: "AN" },
    { name: "Chandigarh", code: "CH" },
    { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
    { name: "Lakshadweep", code: "LD" },
    { name: "Delhi", code: "DL" },
    { name: "Puducherry", code: "PY" },
    { name: "Ladakh", code: "LA" },
    { name: "Jammu and Kashmir", code: "JK" },
  ],

  // Get common categories for cities
  getCommonCityCategories: (): string[] => [
    "Metropolitan",
    "Capital",
    "Tourist Destination",
    "Business Hub",
    "Educational Center",
    "Cultural Heritage",
    "Religious Site",
    "Industrial City",
    "Port City",
    "Hill Station",
    "Beach City",
    "Historical City",
    "Modern City",
    "Smart City",
  ],

  // Get common amenities for cities
  getCommonCityAmenities: (): string[] => [
    "Public Transport",
    "Airport",
    "Railway Station",
    "Bus Terminal",
    "Hospitals",
    "Schools",
    "Universities",
    "Shopping Malls",
    "Restaurants",
    "Hotels",
    "Parks",
    "Museums",
    "Libraries",
    "Sports Facilities",
    "Internet Connectivity",
    "Clean Water",
    "Electricity",
    "Waste Management",
  ],
};
