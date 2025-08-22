import { post } from "../../service";
import {
  CustomTourPlanningRequest,
  InquiryResponse,
  TourInquiryRequest,
  GeneralInquiryRequest,
  LocalBusRentalRequest,
  OutstationBusRentalRequest,
} from "../types/inquiry.types";

export const inquiryService = {
  submitCustomTourPlanning: async (
    data: CustomTourPlanningRequest
  ): Promise<InquiryResponse> => {
    const response = await post<InquiryResponse>(
      "/inquiries/tour/custom-planning",
      data
    );
    return response.data;
  },

  submitTourInquiry: async (
    data: TourInquiryRequest
  ): Promise<InquiryResponse> => {
    const response = await post<InquiryResponse>(
      "/inquiries/tour/inquiry",
      data
    );
    return response.data;
  },

  submitContactUs: async (data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<InquiryResponse> => {
    const response = await post<InquiryResponse>("/inquiries/contact-us", data);
    return response.data;
  },

  submitHelpWidget: async (data: {
    name: string;
    email: string;
    phone: string;
    adults: string;
    children: string;
    destination: string;
  }): Promise<InquiryResponse> => {
    const response = await post<InquiryResponse>(
      "/inquiries/help-widget",
      data
    );
    return response.data;
  },

  submitGeneralInquiry: async (
    data: GeneralInquiryRequest
  ): Promise<InquiryResponse> => {
    const response = await post<InquiryResponse>(
      "/inquiries/inquiry-email",
      data
    );
    return response.data;
  },

  submitLocalBusRental: async (
    data: LocalBusRentalRequest
  ): Promise<InquiryResponse> => {
    const response = await post<InquiryResponse>(
      "/inquiries/rental/local",
      data
    );
    return response.data;
  },

  submitOutstationBusRental: async (
    data: OutstationBusRentalRequest
  ): Promise<InquiryResponse> => {
    const response = await post<InquiryResponse>(
      "/inquiries/rental/outstation",
      data
    );
    return response.data;
  },
};
