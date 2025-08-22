import { post, get, put, del, patch } from "../../service";
import {
  AdminUser,
  CreateUserData,
  UpdateUserData,
  UserListCondition,
  UserListResponse,
  BulkUpdateData,
  DashboardStats,
  CreateUserResponse,
  GetUserResponse,
  IRUserListResponse,
} from "../types/admin.types";

export const adminService = {
  // User Management
  createUser: async (userData: CreateUserData): Promise<CreateUserResponse> => {
    const response = await post<CreateUserResponse>("users/admin", userData);
    return response.data;
  },

  getUser: async (userId: string): Promise<AdminUser> => {
    const response = await get<GetUserResponse>(`users/admin/${userId}`);
    return response.data.data;
  },

  updateUser: async (
    userId: string,
    userData: UpdateUserData
  ): Promise<AdminUser> => {
    const response = await put<AdminUser>(`users/admin/${userId}`, userData);
    return response.data;
  },

  updateUserAccess: async (
    userId: string,
    accessData: { isActive?: boolean; access?: number }
  ): Promise<AdminUser> => {
    const response = await patch<AdminUser>(
      `users/admin/${userId}/access`,
      accessData
    );
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await del(`users/admin/${userId}`);
  },

  listUsers: async (
    condition: UserListCondition
  ): Promise<IRUserListResponse> => {
    const response = await post<IRUserListResponse>(
      "users/admin/list",
      condition
    );
    return response.data;
  },

  bulkUpdateUsers: async (bulkData: BulkUpdateData): Promise<AdminUser[]> => {
    const response = await post<AdminUser[]>(
      "users/admin/bulk-update",
      bulkData
    );
    return response.data;
  },

  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await get<DashboardStats>("users/admin/dashboard/stats");
    return response.data;
  },
};
