import axios, { AxiosError } from "axios";
import { errorPopup } from "./alerts";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const axiosErrorHandling = async (errorCode: number) => {
  if (errorCode === 400) {
    /* Bad request - validation errors */
    return "Invalid request data. Please check your input.";
  } else if (errorCode === 401) {
    /* Unauthorized - session expired or invalid */
    return "Session expired. Please login again.";
  } else if (errorCode === 403) {
    /* Forbidden - access denied */
    return "Access denied. You don't have permission for this action.";
  } else if (errorCode === 404) {
    /* Not found exception */
    return "The requested information could not be found";
  } else if (errorCode === 409) {
    /* Conflict exception */
    return "Conflict occurred";
  } else if (errorCode === 429) {
    /* Rate limit exceeded */
    return "Rate limit exceeded. Please try again later.";
  } else if ([500, 503, 502, 504].includes(errorCode)) {
    /* Internal server error */
    return "Service under maintenance! Please try after some time.";
  } else {
    return "The connection has timed out, please try again.";
  }
};

export const otherErrors = async (
  error: Error & { errorCode?: number; errorMessage?: string }
) => {
  const errorCode = error?.errorCode;

  // Handle specific business logic errors
  if (errorCode && [102, 105, 108].includes(errorCode)) {
    /* Business logic errors */
    errorPopup(error?.errorMessage ?? "");

    // Handle session-related business errors
    if (errorCode === 102) {
      // Session expired
      setTimeout(async () => {
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }, 1000);
    }
  } else if (errorCode) {
    errorPopup(error?.errorMessage ?? "");
  } else {
    errorPopup(error?.message || error?.errorMessage || "");
  }
};

export const handleError = async (error: Error | AxiosError) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      /* API Error Detected */
      if (error?.response?.status) {
        const message = await axiosErrorHandling(error?.response?.status);
        errorPopup(message);

        // Handle specific status codes
        if (error.response.status === 401) {
          // Session expired, redirect to login
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
          }, 2000);
        } else if (error.response.status === 403) {
          // Access denied, check if step-up auth is required
          const responseData = error.response.data;
          if (
            responseData?.message?.includes("Step-up authentication required")
          ) {
            setTimeout(() => {
              if (typeof window !== "undefined") {
                window.location.href = "/security";
              }
            }, 2000);
          }
        }
      } else {
        Swal.fire(
          "Server Error",
          "The server is currently unavailable. Please try again later.",
          "error"
        );
      }
    } else {
      /* Network Error */
      errorPopup(
        error?.message || "Network error. Please check your connection."
      );
    }
  } else {
    /* JavaScript Error */
    await otherErrors(error);
  }
};
