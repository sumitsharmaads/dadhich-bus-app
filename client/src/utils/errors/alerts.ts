import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const errorPopup = (message: string) => {
  Swal.fire({
    title: message,
    text: "",
    icon: "error",
    showConfirmButton: true,
    timer: 5000, // Timeout duration in milliseconds
    timerProgressBar: true,
  });
};

export const successPopup = (message: string) => {
  Swal.fire({
    title: message,
    text: "",
    icon: "success",
    showConfirmButton: true,
    timer: 5000, // Timeout duration in milliseconds
    timerProgressBar: true,
  });
};

export const warningPopup = (message: string) => {
  Swal.fire({
    title: message,
    text: "",
    icon: "warning",
    showConfirmButton: true,
    timer: 5000,
    timerProgressBar: true,
  });
};

export const infoPopup = (message: string) => {
  Swal.fire({
    title: message,
    text: "",
    icon: "info",
    showConfirmButton: true,
    timer: 5000,
    timerProgressBar: true,
  });
};

export const sessionExpiredPopup = () => {
  Swal.fire({
    title: "Session Expired",
    text: "Your session has expired. Please login again.",
    icon: "warning",
    showConfirmButton: true,
    confirmButtonText: "Login",
    allowOutsideClick: false,
  }).then(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  });
};

export const accessDeniedPopup = (message?: string) => {
  Swal.fire({
    title: "Access Denied",
    text: message || "You don't have permission to perform this action.",
    icon: "error",
    showConfirmButton: true,
    confirmButtonText: "OK",
  });
};

export const rateLimitPopup = (retryAfter?: string) => {
  const message = retryAfter
    ? `Rate limit exceeded. Please try again in ${retryAfter} seconds.`
    : "Rate limit exceeded. Please try again later.";

  Swal.fire({
    title: "Rate Limit Exceeded",
    text: message,
    icon: "warning",
    showConfirmButton: true,
    confirmButtonText: "OK",
    timer: 8000,
    timerProgressBar: true,
  });
};

export const stepUpRequiredPopup = () => {
  Swal.fire({
    title: "Additional Verification Required",
    text: "This action requires additional verification. Please complete the step-up authentication.",
    icon: "info",
    showConfirmButton: true,
    confirmButtonText: "Continue",
    allowOutsideClick: false,
  }).then(() => {
    if (typeof window !== "undefined") {
      window.location.href = "/security";
    }
  });
};

export const confirmPopup = async (message: string): Promise<boolean> => {
  const result = await Swal.fire({
    title: "Confirm Action",
    text: message,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    reverseButtons: true,
  });
  return result.isConfirmed;
};
