import { post, get, put } from "@/lib/service";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQsResponse {
  success: boolean;
  data: {
    _id: string;
    questions: FAQItem[];
    createdAt: string;
    updatedAt: string;
  };
  message: string;
}

export interface UpdateFAQsRequest {
  questions: FAQItem[];
}

export const faqsService = {
  getCurrentFAQs: async (): Promise<FAQsResponse> => {
    const response = await get<FAQsResponse>("/faqs");
    return response.data;
  },

  updateFAQs: async (data: UpdateFAQsRequest): Promise<FAQsResponse> => {
    const response = await put<FAQsResponse>(`/faqs/update`, data);
    return response.data;
  },

  initializeFAQs: async (): Promise<FAQsResponse> => {
    const response = await get<FAQsResponse>("/faqs/initialize");
    return response.data;
  },

  getFAQsCount: async (): Promise<{
    success: boolean;
    data: { count: number };
    message: string;
  }> => {
    const response = await get<{
      success: boolean;
      data: { count: number };
      message: string;
    }>("/faqs/count");
    return response.data;
  },

  cleanupFAQs: async (): Promise<{
    success: boolean;
    message: string;
    code: string;
  }> => {
    const response = await get<{
      success: boolean;
      message: string;
      code: string;
    }>("/faqs/cleanup");
    return response.data;
  },
};
