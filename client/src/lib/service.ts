import axiosInstance from "./api/axiosInstance";

// Generic API functions that automatically handle CSRF tokens
export const get = async <T>(url: string, config?: any) => {
  const response = await axiosInstance.get<T>(url, config);
  return response;
};

export const post = async <T>(url: string, data?: any, config?: any) => {
  // CSRF token is automatically added by axios interceptor
  const response = await axiosInstance.post<T>(url, data, config);
  return response;
};

export const put = async <T>(url: string, data?: any, config?: any) => {
  // CSRF token is automatically added by axios interceptor
  const response = await axiosInstance.put<T>(url, data, config);
  return response;
};

export const del = async <T>(url: string, config?: any) => {
  // CSRF token is automatically added by axios interceptor
  const response = await axiosInstance.delete<T>(url, config);
  return response;
};

export const patch = async <T>(url: string, data?: any, config?: any) => {
  // CSRF token is automatically added by axios interceptor
  const response = await axiosInstance.patch<T>(url, data, config);
  return response;
};

// Helper function to check if CSRF token is available
export const hasCsrfToken = (): boolean => {
  return !!axiosInstance.defaults.headers.common["x-csrf-token"];
};
