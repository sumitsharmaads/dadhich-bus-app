import { get, post, put, del } from "../../service";
import {
  Tour,
  TourListItem,
  TourSearchParams,
  TourSearchResponse,
  UpcomingToursResponse,
  TourPriceRange,
  TourFacets,
  StateBreakupResponse,
  TourStats,
} from "../types/tour.types";

export const tourService = {
  // Get upcoming tours
  getUpcomingTours: async (
    limit: number = 4
  ): Promise<UpcomingToursResponse> => {
    const response = await get<UpcomingToursResponse>(
      `tours/upcoming?limit=${limit}`
    );
    return response.data;
  },

  // Get tour by ID (public)
  getTourById: async (id: string): Promise<Tour> => {
    const response = await get<{
      success: boolean;
      message: string;
      data: Tour;
      meta: any;
    }>(`tours/public/${id}`);
    return response?.data?.data;
  },

  // Get tour by ID for admin (includes all fields)
  getAdminTourById: async (id: string): Promise<Tour> => {
    const response = await get<{
      success: boolean;
      message: string;
      data: Tour;
      meta: any;
    }>(`tours/admin/${id}`);
    return response?.data?.data;
  },

  // Search tours with filters
  searchTours: async (
    params: TourSearchParams
  ): Promise<TourSearchResponse> => {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response = await get<TourSearchResponse>(
      `tours?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get price range
  getPriceRange: async (): Promise<TourPriceRange> => {
    const response = await get<TourPriceRange>("tours/price-range");
    return response.data;
  },

  // Get tour facets
  getFacets: async (): Promise<{
    success: boolean;
    data: TourFacets;
    message: string;
  }> => {
    const response = await get<{
      success: boolean;
      data: TourFacets;
      message: string;
    }>("tours/facets");
    return response.data;
  },

  // Get tour stats
  getStats: async (): Promise<TourStats> => {
    const response = await get<TourStats>("tours/stats");
    return response.data;
  },

  // Get state breakup for destinations
  getStateBreakup: async (): Promise<StateBreakupResponse> => {
    const response = await get<StateBreakupResponse>("tours/state-breakup");
    return response.data;
  },

  // ========== ADMIN OPERATIONS ==========

  // Get admin tour list with pagination and filters
  getAdminTourList: async (params: {
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
  }): Promise<{
    success: boolean;
    data: {
      tours: Tour[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    message: string;
  }> => {
    try {
      const response = await get<any>("tours/admin/list", { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new tour
  createTour: async (
    tourData: Partial<Tour>
  ): Promise<{
    success: boolean;
    data: Tour;
    message: string;
  }> => {
    const response = await post<any>("tours", tourData);
    return response.data;
  },

  // Update existing tour
  updateTour: async (
    id: string,
    tourData: Partial<Tour>
  ): Promise<{
    success: boolean;
    data: Tour;
    message: string;
  }> => {
    const response = await put<any>(`tours/${id}`, tourData);
    return response.data;
  },

  // Delete tour
  deleteTour: async (
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await del<any>(`tours/${id}`);
    return response.data;
  },

  // Publish tour
  publishTour: async (
    id: string
  ): Promise<{
    success: boolean;
    data: Tour;
    message: string;
  }> => {
    const response = await post<any>(`tours/${id}/publish`);
    return response.data;
  },

  // Draft tour
  draftTour: async (
    id: string
  ): Promise<{
    success: boolean;
    data: Tour;
    message: string;
  }> => {
    const response = await post<any>(`tours/${id}/draft`);
    return response.data;
  },

  // Toggle tour active status
  toggleTourActive: async (
    id: string,
    isActive: boolean
  ): Promise<{
    success: boolean;
    data: Tour;
    message: string;
  }> => {
    const response = await put<any>(`tours/${id}/toggle-active`, { isActive });
    return response.data;
  },

  // Get tour statistics for admin dashboard
  getAdminTourStats: async (): Promise<{
    success: boolean;
    data: {
      totalTours: number;
      publishedTours: number;
      draftTours: number;
      activeTours: number;
      totalCapacity: number;
      totalRevenue: number;
      upcomingTours: number;
      completedTours: number;
    };
    message: string;
  }> => {
    const response = await get<any>("tours/admin/stats");
    return response.data;
  },

  // Bulk operations
  bulkPublishTours: async (
    tourIds: string[]
  ): Promise<{
    success: boolean;
    message: string;
    data: { successCount: number; failedCount: number; failedIds: string[] };
  }> => {
    const response = await post<any>("tours/admin/bulk-publish", { tourIds });
    return response.data;
  },

  bulkDraftTours: async (
    tourIds: string[]
  ): Promise<{
    success: boolean;
    message: string;
    data: { successCount: number; failedCount: number; failedIds: string[] };
  }> => {
    const response = await post<any>("tours/admin/bulk-draft", { tourIds });
    return response.data;
  },

  bulkDeleteTours: async (
    tourIds: string[]
  ): Promise<{
    success: boolean;
    message: string;
    data: { successCount: number; failedCount: number; failedIds: string[] };
  }> => {
    const response = await post<any>("tours/admin/bulk-delete", { tourIds });
    return response.data;
  },

  // Export tours
  exportTours: async (params: {
    format: "csv" | "excel";
    filters?: any;
  }): Promise<{
    success: boolean;
    data: {
      downloadUrl: string;
      filename?: string;
      totalTours?: number;
      message?: string;
    };
    message: string;
  }> => {
    const response = await post<any>("tours/admin/export", params);
    return response.data;
  },

  // Import tours
  importTours: async (
    file: File
  ): Promise<{
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
  }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await post<any>("tours/admin/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Get available buses for tour assignment
  getAvailableBuses: async (): Promise<{
    success: boolean;
    data: Array<{
      _id: string;
      registrationNumber: string;
      capacity: number;
      isActive: boolean;
      type: string;
    }>;
    message: string;
  }> => {
    const response = await get<any>("tours/admin/buses");
    return response.data;
  },

  // Get available captains for tour assignment
  getAvailableCaptains: async (): Promise<{
    success: boolean;
    data: Array<{
      _id: string;
      fullname: string;
      username: string;
      email: string;
      phone: string;
      isActive: boolean;
      licenseNumber?: string;
      experience?: number;
    }>;
    message: string;
  }> => {
    const response = await get<any>("tours/admin/captains");
    return response.data;
  },

  // Get tour categories
  getTourCategories: async (): Promise<{
    success: boolean;
    data: string[];
    message: string;
  }> => {
    const response = await get<any>("tours/categories");
    return response.data;
  },

  // Get tour types
  getTourTypes: async (): Promise<{
    success: boolean;
    data: Array<{ _id: string; name: string; description?: string }>;
    message: string;
  }> => {
    const response = await get<any>("tours/types");
    return response.data;
  },

  // Download tour template for bulk upload
  downloadTourTemplate: async (): Promise<void> => {
    const response = await get("/tours/admin/template", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data as BlobPart])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "tour_bulk_template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
