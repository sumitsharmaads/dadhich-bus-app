import axios, { AxiosError } from "axios";
import { errorPopup } from "@/utils/errors/alerts";
import User from "@/utils/User";

const domain = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

let logout: Function | null = null;
let updateUserInfo: Function | null = null;

const axiosInstance = axios.create({
  baseURL: domain,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: This enables cookies to be sent with requests
});

export const setAuthHandlers = (
  logoutHandler: Function,
  updateUserInfoHandler: Function
) => {
  logout = logoutHandler;
  updateUserInfo = updateUserInfoHandler;
};

// CSRF token management
let csrfToken: string | null = null;

export const setCsrfToken = (token: string) => {
  csrfToken = token;
};

export const getCsrfToken = (): string | null => {
  return csrfToken;
};

// Extract CSRF token from cookies
const extractCsrfToken = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  const csrfCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("csrf_token=")
  );

  if (csrfCookie) {
    return csrfCookie.split("=")[1];
  }

  return null;
};

axiosInstance.interceptors.request.use(
  (request) => {
    request.withCredentials = true;

    // Add CSRF token for state-changing operations
    const method = request.method?.toUpperCase();
    if (method && ["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      const token = csrfToken || extractCsrfToken();
      if (token) {
        request.headers["x-csrf-token"] = token;
      }
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Extract CSRF token from response cookies if present
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const csrfCookie = setCookieHeader.find((cookie) =>
        cookie.includes("csrf_token=")
      );
      if (csrfCookie) {
        const token = csrfCookie.split("csrf_token=")[1].split(";")[0];
        setCsrfToken(token);
      }
    }

    return response;
  },
  async (error: AxiosError) => {
    const responseData: any = error.response?.data;
    const status = error.response?.status;

    // Handle session expiration (401 Unauthorized)
    if (status === 401) {
      if (logout) {
        logout();
      } else {
        User.logout();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }

    // Handle access denied (403 Forbidden)
    if (status === 403) {
      const message =
        responseData?.message ||
        "Access denied. You don't have permission for this action.";
      errorPopup(message);

      // If it's a step-up authentication required, redirect to security page
      if (responseData?.message?.includes("Step-up authentication required")) {
        if (typeof window !== "undefined") {
          window.location.href = "/security";
        }
      }

      return Promise.reject(error);
    }

    // Handle rate limiting (429 Too Many Requests)
    if (status === 429) {
      const retryAfter = error.response?.headers["retry-after"];
      const message = retryAfter
        ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
        : "Rate limit exceeded. Please try again later.";
      errorPopup(message);
      return Promise.reject(error);
    }

    // Handle validation errors (400 Bad Request)
    if (status === 400) {
      const message =
        responseData?.message ||
        "Invalid request data. Please check your input.";
      errorPopup(message);
      return Promise.reject(error);
    }

    // Handle server errors (500+)
    if (status && status >= 500) {
      const message = "Server error. Please try again later.";
      errorPopup(message);
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
