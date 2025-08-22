import { get, post, put, del } from "@/lib/service";

export interface TermsItem {
  _id: string;
  title: string;
  text: string;
  version: number;
  isCurrent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TermsResponse {
  success: boolean;
  data: TermsItem;
  message: string;
}

export interface TermsListResponse {
  success: boolean;
  data: TermsItem[];
  message: string;
}

export interface CreateTermsRequest {
  title: string;
  text: string;
  isCurrent: boolean;
}

export interface UpdateTermsRequest {
  title?: string;
  text?: string;
}

export const termsService = {
  getCurrentTerms: async (): Promise<TermsResponse> => {
    const response = await get<TermsResponse>("/terms/current");
    return response.data;
  },

  getTermsById: async (id: string): Promise<TermsResponse> => {
    const response = await get<TermsResponse>(`/terms/${id}`);
    return response.data;
  },

  listTerms: async (): Promise<TermsListResponse> => {
    const response = await get<TermsListResponse>("/terms");
    return response.data;
  },

  createTerms: async (data: CreateTermsRequest): Promise<TermsResponse> => {
    const response = await post<TermsResponse>("/terms", data);
    return response.data;
  },

  updateTerms: async (
    id: string,
    data: UpdateTermsRequest
  ): Promise<TermsResponse> => {
    const response = await put<TermsResponse>(`/terms/${id}`, data);
    return response.data;
  },

  deleteTerms: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await del<{ success: boolean; message: string }>(
      `/terms/${id}`
    );
    return response.data;
  },
};
