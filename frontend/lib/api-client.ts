"use client";

import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { toast } from "sonner";

function getApiErrorMessage(error: AxiosError): string {
  // NestJS typical error shape: { message: string | string[], error: string, statusCode: number }
  const data: any = error.response?.data;
  const msg = data?.message;
  if (Array.isArray(msg)) return msg.join("\n");
  if (typeof msg === "string" && msg.trim()) return msg;
  if (typeof data === "string" && data.trim()) return data;
  if (error.message) return error.message;
  return "Something went wrong. Please try again.";
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    // 'Content-Type': 'application/json', // Let axios set this, especially for FormData
  },
  withCredentials: true,
});

// Request Interceptor: Add Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    // Get language preference from localStorage or default to 'ar'
    const language =
      typeof window !== "undefined"
        ? (localStorage.getItem("language") || "ar")
        : "ar";

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }

    // Set Accept-Language header for backend localization interceptor
    config.headers["Accept-Language"] = language;

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle errors globally (401 redirect + toast notifications)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // 401 Unauthorized: Redirect to login
    if (status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Global toast for API errors (can be disabled per-request with { skipToast: true })
    const skipToast = Boolean((error.config as any)?.skipToast);
    if (typeof window !== "undefined" && !skipToast) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
