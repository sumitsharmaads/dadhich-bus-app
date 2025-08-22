import { get } from "@/lib/service";
import { WebsiteInfoType } from "@/types";

/**
 * Website service for handling website configuration API calls
 */
class WebsiteService {
  private readonly baseUrl = "/websites";

  /**
   * Get website configuration by hostname
   */
  async getWebsiteByHost(host: string): Promise<WebsiteInfoType> {
    try {
      const response = await get<WebsiteInfoType>(
        `${this.baseUrl}/by-host?host=${host}`
      );
      const payload = (response as any)?.data;
      const result = payload?.result || payload?.data || null;

      if (!result) {
        throw new Error("No website configuration found");
      }

      return result as WebsiteInfoType;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Website configuration not found for this domain");
      } else if (error.response?.status === 500) {
        throw new Error("Server error while fetching website configuration");
      } else {
        throw new Error(
          error.message || "Failed to fetch website configuration"
        );
      }
    }
  }

  /**
   * Get website configuration by ID
   */
  async getWebsiteById(id: string): Promise<WebsiteInfoType> {
    try {
      const response = await get<WebsiteInfoType>(`${this.baseUrl}/${id}`);
      const payload = (response as any)?.data;
      const result = payload?.result || payload?.data || null;

      if (!result) {
        throw new Error("Website configuration not found");
      }

      return result as WebsiteInfoType;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error("Website configuration not found");
      } else if (error.response?.status === 500) {
        throw new Error("Server error while fetching website configuration");
      } else {
        throw new Error(
          error.message || "Failed to fetch website configuration"
        );
      }
    }
  }
}

export const websiteService = new WebsiteService();
export default websiteService;
