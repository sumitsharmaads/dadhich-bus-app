import { post, del, get } from "@/lib/service";
import {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ChangePasswordRequest,
  SelfUpdateRequest,
  AuthResponse,
  ErrorResponse,
  SessionsResponse,
  SessionResponse,
} from "../types/auth.types";
import { successPopup, errorPopup } from "@/utils/errors/alerts";

class AuthService {
  private readonly baseUrl = "/auth";

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(
        `${this.baseUrl}/register`,
        data
      );

      // Show success message
      successPopup(
        "Registration successful! Please check your email for verification."
      );

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 409) {
        errorPopup(
          "Email already in use. Please use a different email address."
        );
      } else if (error.response?.status === 400) {
        errorPopup("Invalid registration data. Please check your input.");
      } else if (error.response?.status === 429) {
        errorPopup("Too many registration attempts. Please try again later.");
      } else {
        errorPopup("Registration failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(`${this.baseUrl}/login`, data);

      // Show success message
      successPopup("Login successful! Welcome back.");

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorPopup("Invalid email or password. Please try again.");
      } else if (error.response?.status === 400) {
        errorPopup("Invalid login data. Please check your input.");
      } else if (error.response?.status === 429) {
        errorPopup("Too many login attempts. Please try again later.");
      } else {
        errorPopup("Login failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Forgot password
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(
        `${this.baseUrl}/forgot-password`,
        data
      );

      // Show success message
      successPopup(
        "Password reset link sent to your email. Please check your inbox."
      );

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 404) {
        errorPopup("Email not found. Please check your email address.");
      } else if (error.response?.status === 400) {
        errorPopup("Invalid email address. Please check your input.");
      } else if (error.response?.status === 429) {
        errorPopup("Too many password reset attempts. Please try again later.");
      } else {
        errorPopup("Password reset failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Change password (authenticated user)
   */
  async changePassword(data: ChangePasswordRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(
        `${this.baseUrl}/change-password`,
        data
      );

      // Show success message
      successPopup("Password changed successfully!");

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        errorPopup("Invalid password data. Please check your input.");
      } else if (error.response?.status === 401) {
        errorPopup("Current password is incorrect. Please try again.");
      } else if (error.response?.status === 429) {
        errorPopup(
          "Too many password change attempts. Please try again later."
        );
      } else {
        errorPopup("Password change failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Update user profile (authenticated user)
   */
  async updateProfile(data: SelfUpdateRequest): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>(`${this.baseUrl}/me`, data);

      // Show success message
      successPopup("Profile updated successfully!");

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        errorPopup("Invalid profile data. Please check your input.");
      } else if (error.response?.status === 401) {
        errorPopup("Please login to update your profile.");
      } else if (error.response?.status === 429) {
        errorPopup("Too many update attempts. Please try again later.");
      } else {
        errorPopup("Profile update failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Get current authenticated user data
   */
  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await post<AuthResponse>("/users/me");

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorPopup("Please login to access your profile.");
      } else if (error.response?.status === 404) {
        errorPopup("User not found. Please login again.");
      } else {
        errorPopup("Failed to fetch user data. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Logout current session
   */
  async logout(): Promise<SessionResponse> {
    try {
      const response = await post<SessionResponse>(`${this.baseUrl}/logout`);

      // Show success message
      successPopup("Logged out successfully!");

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorPopup("Please login to logout.");
      } else {
        errorPopup("Logout failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Logout from all devices
   */
  async logoutAllDevices(): Promise<SessionResponse> {
    try {
      const response = await post<SessionResponse>(
        `${this.baseUrl}/logout-all`
      );

      // Show success message
      successPopup("Logged out from all devices successfully!");

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorPopup("Please login to logout from all devices.");
      } else {
        errorPopup("Logout from all devices failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Get all user sessions
   */
  async getSessions(): Promise<SessionsResponse> {
    try {
      const response = await get<SessionsResponse>(`${this.baseUrl}/sessions`);

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorPopup("Please login to view your sessions.");
      } else {
        errorPopup("Failed to fetch sessions. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Terminate a specific session
   */
  async terminateSession(sessionId: string): Promise<SessionResponse> {
    try {
      const response = await del<SessionResponse>(
        `${this.baseUrl}/sessions/${sessionId}`
      );

      // Show success message
      successPopup("Session terminated successfully!");

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        errorPopup("Please login to terminate sessions.");
      } else if (error.response?.status === 404) {
        errorPopup("Session not found.");
      } else if (error.response?.status === 400) {
        errorPopup("Cannot terminate current session.");
      } else {
        errorPopup("Failed to terminate session. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Validate password strength
   */
  async validatePassword(
    password: string
  ): Promise<{ strength: any; isValid: boolean }> {
    try {
      const response = await post<{
        success: boolean;
        data: { strength: any; isValid: boolean };
      }>(`${this.baseUrl}/validate-password`, { password });

      // Return the data object from the API response
      return response.data.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        errorPopup("Password is required for validation.");
      } else if (error.response?.status === 429) {
        errorPopup("Too many validation attempts. Please try again later.");
      } else {
        errorPopup("Password validation failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string; data: any }> {
    try {
      const response = await get<{
        success: boolean;
        message: string;
        data: any;
      }>(`${this.baseUrl}/verify-email?token=${encodeURIComponent(token)}`);

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        errorPopup(
          "Invalid verification token. Please check your email for the correct link."
        );
      } else if (error.response?.status === 404) {
        errorPopup(
          "Verification token not found. The link may be expired or invalid."
        );
      } else {
        errorPopup("Email verification failed. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    try {
      const response = await post<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/resend-verification`, { email });

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        errorPopup("Email is required.");
      } else if (error.response?.status === 404) {
        errorPopup("User not found with this email address.");
      } else if (error.response?.status === 429) {
        errorPopup(
          "Please wait 5 minutes before requesting another verification email."
        );
      } else {
        errorPopup(
          "Failed to send verification email. Please try again later."
        );
      }

      throw error;
    }
  }

  // Password Reset
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    try {
      const response = await post<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/forgot-password`, { email });

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error(
          error.response?.data?.message ||
            "Invalid email address. Please check and try again."
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          "Please verify your email address before resetting your password."
        );
      } else if (error.response?.status === 429) {
        throw new Error(
          "Too many password reset attempts. Please try again later."
        );
      }

      throw error;
    }
  }

  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    try {
      const response = await post<{
        success: boolean;
        message: string;
      }>(`${this.baseUrl}/reset-password`, { token, newPassword });

      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error(
          error.response?.data?.message ||
            "Invalid or expired reset token. Please request a new one."
        );
      } else if (error.response?.status === 404) {
        throw new Error("User not found. Please contact support.");
      } else if (error.response?.status === 429) {
        throw new Error("Too many attempts. Please try again later.");
      }

      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
