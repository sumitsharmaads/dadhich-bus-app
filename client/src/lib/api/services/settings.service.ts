import { get, post, put, del } from "@/lib/service";
import { WebsiteInfoType } from "@/types";

export interface ImageUploadResponse {
  success: boolean;
  data: {
    public_id: string;
    secure_url: string;
  };
  message: string;
}

export interface WebsiteSettingsResponse {
  success: boolean;
  data: WebsiteInfoType;
  message: string;
}

export interface WebsiteSettingsListResponse {
  success: boolean;
  data: WebsiteInfoType[];
  message: string;
}

export interface CreateWebsiteSettingsRequest {
  [key: string]: any;
}

export interface UpdateWebsiteSettingsRequest {
  [key: string]: any;
}

export interface ImageUploadRequest {
  image: File;
  folder?: string;
}

export interface DeleteImageRequest {
  publicId: string;
}

export interface RenameImageRequest {
  fromPublicId: string;
  toPublicId: string;
}

/**
 * Comprehensive settings service for handling all admin settings API calls
 */
export const settingsService = {
  // Website Configuration
  getWebsiteById: async (id: string): Promise<WebsiteSettingsResponse> => {
    const response = await get<WebsiteSettingsResponse>(`/websites/${id}`);
    return response.data;
  },

  getWebsiteSettings: async (id: string): Promise<WebsiteSettingsResponse> => {
    const response = await get<WebsiteSettingsResponse>(
      `/websites/${id}/settings`
    );
    return response.data;
  },

  getWebsiteByHost: async (): Promise<WebsiteSettingsResponse> => {
    const response = await get<WebsiteSettingsResponse>("/websites/by-host");
    return response.data;
  },

  listWebsites: async (): Promise<WebsiteSettingsListResponse> => {
    const response = await get<WebsiteSettingsListResponse>("/websites");
    return response.data;
  },

  createWebsite: async (
    data: CreateWebsiteSettingsRequest
  ): Promise<WebsiteSettingsResponse> => {
    const response = await post<WebsiteSettingsResponse>("/websites", data);
    return response.data;
  },

  updateWebsite: async (
    id: string,
    data: UpdateWebsiteSettingsRequest
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}`,
      data
    );
    return response.data;
  },

  deleteWebsite: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>(
      `/websites/${id}`
    );
    return response.data;
  },

  // Image Management
  uploadImage: async (
    data: ImageUploadRequest
  ): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append("image", data.image);
    if (data.folder) {
      formData.append("folder", data.folder);
    }

    const response = await post<ImageUploadResponse>(
      "/media/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  uploadMultipleImages: async (
    files: File[],
    folder?: string
  ): Promise<{
    success: boolean;
    data: {
      count: number;
      results: Array<{ public_id: string; secure_url: string }>;
    };
    message: string;
  }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (folder) {
      formData.append("folder", folder);
    }

    const response = await post<{
      success: boolean;
      data: {
        count: number;
        results: Array<{ public_id: string; secure_url: string }>;
      };
      message: string;
    }>("/media/upload-multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteImage: async (
    data: DeleteImageRequest
  ): Promise<{ success: boolean; data: { ok: boolean }; message: string }> => {
    const response = await post<{
      success: boolean;
      data: { ok: boolean };
      message: string;
    }>("/media/delete", data);
    return response.data;
  },

  renameImage: async (
    data: RenameImageRequest
  ): Promise<{
    success: boolean;
    data: { public_id: string; secure_url: string };
    message: string;
  }> => {
    const response = await post<{
      success: boolean;
      data: { public_id: string; secure_url: string };
      message: string;
    }>("/media/rename", data);
    return response.data;
  },

  // Settings-specific methods for easier usage
  updateGeneralSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateBrandingSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateContactSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateBusinessSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateBookingSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateRentalSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateSEOSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateAnalyticsSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateDomainSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },

  updateSystemSettings: async (
    id: string,
    data: Partial<WebsiteInfoType>
  ): Promise<WebsiteSettingsResponse> => {
    const response = await put<WebsiteSettingsResponse>(
      `/websites/${id}/settings`,
      data
    );
    return response.data;
  },
};

export default settingsService;
