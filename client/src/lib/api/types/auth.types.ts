// Authentication API Types

export interface RegisterRequest {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface SelfUpdateRequest {
  fullname?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
}

export interface UserResponse {
  id: string;
  email: string;
  fullname: string;
  username: string;
  phone: string;
  gender: string;
  roleType: number;
  isActive: boolean;
  isVerified: boolean;
  access: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: UserResponse;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  status?: number;
  errorCode?: string;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}
