// Admin-related API types

export interface AdminUser {
  _id: string;
  fullname: string;
  email: string;
  username: string;
  phone?: number;
  gender?: string;
  roleType: number;
  access: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  fullname: string;
  email: string;
  phone: string;
  gender: string;
  roleType: number;
  password: string;
}

export interface UpdateUserData {
  fullname?: string;
  phone?: string;
  gender?: string;
  roleType?: number;
  isActive?: boolean;
  access?: number;
}

export interface UserListCondition {
  search?: {
    email?: string;
    fullname?: string;
    username?: string;
  };
  roleTypes?: number | number[];
  access?: number;
  isActive?: boolean;
  page?: number;
  items?: number;
  sort?: Record<string, 1 | -1>;
}

export interface IRUserListResponse {
  success: boolean;
  data: UserListResponse;
  message: string;
}
export interface UserListResponse {
  count: number;
  users: AdminUser[];
}

export interface BulkUpdateData {
  userIds: string[];
  updates: UpdateUserData;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  captainUsers: number;
  inactiveUsers: number;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  fullname: string;
}

export interface GetUserResponse {
  data: AdminUser;
}

// Role and Access Enums
export enum UserRole {
  ADMIN = 0,
  USER = 1,
  CAPTAIN = 2,
}

export enum UserAccess {
  FROZEN = -1,
  ACTIVE = 0,
  AWAITING_ACTIVATION = 1,
  REQUIRES_PASSWORD_RESET = 2,
}

export enum UserGender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}
