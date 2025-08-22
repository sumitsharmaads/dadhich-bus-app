import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axiosInstance from "../api/axiosInstance";
import { AddUpRequestTypes } from "@/types";
import { handleError } from "@/utils/errors/axiosErrors";
import { successPopup } from "@/utils/errors/alerts";

const handleLoading = (status: boolean, loading?: (status: boolean) => void) =>
  loading && loading(status);

/**
 * Generic function to handle all GET requests.
 * @param url The URL endpoint to make the GET request to.
 * @param config Additional Axios config (headers, params, etc).
 */
export const get = async <T>(
  url: string,
  config: AxiosRequestConfig = {},
  addUpConfig?: AddUpRequestTypes
): Promise<AxiosResponse<T>> => {
  const { setLoading, showSuccess, successMessage } = addUpConfig || {};
  handleLoading(true, setLoading);
  try {
    const response = await axiosInstance.get(url, config);
    handleLoading(false, setLoading);
    if (showSuccess) {
      successPopup(successMessage || response.data.message);
    }
    return response;
  } catch (error: any) {
    handleLoading(false, setLoading);
    handleError(error);
    return Promise.reject(error);
  }
};

/**
 * Generic function to handle all POST requests.
 * @param url The URL endpoint to make the POST request to.
 * @param data The data to be sent in the POST request body.
 * @param config Additional Axios config (headers, params, etc).
 */
export const post = async <T>(
  url: string,
  data: any,
  config: AxiosRequestConfig = {},
  addUpConfig?: AddUpRequestTypes
): Promise<AxiosResponse<T>> => {
  const { setLoading, showSuccess, successMessage } = addUpConfig || {};
  handleLoading(true, setLoading);
  try {
    const response = await axiosInstance.post(url, data, config);
    handleLoading(false, setLoading);
    if (showSuccess) {
      successPopup(successMessage || response.data.message);
    }
    return response;
  } catch (error: any) {
    handleLoading(false, setLoading);
    handleError(error);
    return Promise.reject(error);
  }
};

/**
 * Generic function to handle all PUT requests.
 * @param url The URL endpoint to make the PUT request to.
 * @param data The data to be sent in the PUT request body.
 * @param config Additional Axios config (headers, params, etc).
 */
export const put = async <T>(
  url: string,
  data: any,
  config: AxiosRequestConfig = {},
  addUpConfig?: AddUpRequestTypes
): Promise<AxiosResponse<T>> => {
  const { setLoading, showSuccess, successMessage } = addUpConfig || {};
  handleLoading(true, setLoading);
  try {
    const response = await axiosInstance.put(url, data, config);
    handleLoading(false, setLoading);
    if (showSuccess) {
      successPopup(successMessage || response.data.message);
    }
    return response;
  } catch (error: any) {
    handleLoading(false, setLoading);
    handleError(error);
    return Promise.reject(error);
  }
};

/**
 * Generic function to handle all PATCH requests.
 * @param url The URL endpoint to make the PATCH request to.
 * @param data The data to be sent in the PATCH request body.
 * @param config Additional Axios config (headers, params, etc).
 */
export const patch = async <T>(
  url: string,
  data: any,
  config: AxiosRequestConfig = {},
  addUpConfig?: AddUpRequestTypes
): Promise<AxiosResponse<T>> => {
  const { setLoading, showSuccess, successMessage } = addUpConfig || {};
  handleLoading(true, setLoading);
  try {
    const response = await axiosInstance.patch(url, data, config);
    handleLoading(false, setLoading);
    if (showSuccess) {
      successPopup(successMessage || response.data.message);
    }
    return response;
  } catch (error: any) {
    handleLoading(false, setLoading);
    handleError(error);
    return Promise.reject(error);
  }
};

/**
 * Generic function to handle all DELETE requests.
 * @param url The URL endpoint to make the DELETE request to.
 * @param config Additional Axios config (headers, params, etc).
 */
export const remove = async <T>(
  url: string,
  config: AxiosRequestConfig = {},
  addUpConfig?: AddUpRequestTypes
): Promise<AxiosResponse<T>> => {
  const { setLoading, showSuccess, successMessage } = addUpConfig || {};
  handleLoading(true, setLoading);
  try {
    const response = await axiosInstance.delete(url, config);
    handleLoading(false, setLoading);
    if (showSuccess) {
      successPopup(successMessage || response.data.message);
    }
    return response;
  } catch (error: any) {
    handleLoading(false, setLoading);
    handleError(error);
    return Promise.reject(error);
  }
};

export default { get, post, put, patch };
