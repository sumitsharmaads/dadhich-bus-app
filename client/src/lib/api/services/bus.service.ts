import { post, get, put, del, patch } from "../../service";
import {
  Bus,
  CreateBusData,
  UpdateBusData,
  BusListCondition,
  BusListResponse,
  BusStats,
  BulkUpdateData,
  BulkDeleteData,
  BusStatusUpdate,
  SeatLayoutUpdate,
  CreateBusResponse,
  GetBusResponse,
  GetBusStatsResponse,
  GetSeatLayoutResponse,
  IRBusListResponse,
} from "../types/bus.types";

export const busService = {
  // Basic CRUD operations
  createBus: async (busData: CreateBusData): Promise<CreateBusResponse> => {
    const response = await post<CreateBusResponse>("buses", busData);
    return response.data;
  },

  getBus: async (busId: string): Promise<Bus> => {
    const response = await get<GetBusResponse>(`buses/${busId}`);
    return response.data.data;
  },

  updateBus: async (busId: string, busData: UpdateBusData): Promise<Bus> => {
    const response = await put<Bus>(`buses/${busId}`, busData);
    return response.data;
  },

  deleteBus: async (busId: string): Promise<void> => {
    await del(`buses/${busId}`);
  },

  // List and search buses
  listBuses: async (condition: BusListCondition): Promise<BusListResponse> => {
    const response = await get<IRBusListResponse>("buses/admin", {
      params: condition,
    });
    return response.data?.data;
  },

  // Bus statistics
  getBusStats: async (): Promise<BusStats> => {
    const response = await get<GetBusStatsResponse>("buses/admin/stats");
    return response.data.data;
  },

  // Bulk operations
  bulkUpdateBuses: async (bulkData: BulkUpdateData): Promise<Bus[]> => {
    const response = await post<Bus[]>("buses/admin/bulk-update", bulkData);
    return response.data;
  },

  bulkDeleteBuses: async (bulkData: BulkDeleteData): Promise<Bus[]> => {
    const response = await post<Bus[]>("buses/admin/bulk-delete", bulkData);
    return response.data;
  },

  // Status management
  updateBusStatus: async (
    busId: string,
    status: BusStatusUpdate
  ): Promise<Bus> => {
    const response = await patch<Bus>(`buses/${busId}/status`, status);
    return response.data;
  },

  // Seat layout management
  getBusSeatLayout: async (
    busId: string
  ): Promise<GetSeatLayoutResponse["data"]> => {
    const response = await get<GetSeatLayoutResponse>(
      `buses/${busId}/seat-layout`
    );
    return response.data.data;
  },

  updateBusSeatLayout: async (
    busId: string,
    seatLayout: SeatLayoutUpdate
  ): Promise<Bus> => {
    const response = await put<Bus>(`buses/${busId}/seat-layout`, seatLayout);
    return response.data;
  },

  // Utility methods
  toggleBusStatus: async (
    busId: string,
    currentStatus: boolean
  ): Promise<Bus> => {
    return busService.updateBusStatus(busId, { isActive: !currentStatus });
  },

  // Get buses by type
  getBusesByType: async (type: string): Promise<Bus[]> => {
    const response = await get<BusListResponse>("buses/admin", {
      params: { type, items: 100 },
    });
    return response.data.buses;
  },

  // Get active buses
  getActiveBuses: async (): Promise<Bus[]> => {
    const response = await get<BusListResponse>("buses/admin", {
      params: { isActive: true, items: 100 },
    });
    return response.data.buses;
  },
};
