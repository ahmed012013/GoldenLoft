import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { toast } from "sonner";
import { logger } from "./logger";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipToast?: boolean;
    _retryCount?: number;
  }
}

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

interface NestError {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

function getApiErrorMessage(error: AxiosError): string {
  // NestJS typical error shape: { message: string | string[], error: string, statusCode: number }
  const data = error.response?.data as NestError | string | undefined;

  if (typeof data === "string" && data.trim()) return data;

  if (data && typeof data === "object") {
    const msg = data.message;
    if (Array.isArray(msg)) return msg.join("\n");
    if (typeof msg === "string" && msg.trim()) return msg;
  }

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

// Request Interceptor: Pass localization only (auth handled by HttpOnly cookies)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get language preference from localStorage or default to 'ar'
    const language =
      typeof window !== "undefined"
        ? localStorage.getItem("language") || "ar"
        : "ar";

    // Set Accept-Language header for backend localization interceptor
    config.headers["Accept-Language"] = language;

    return config;
  },
  (error: AxiosError) => {
    logger.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle errors globally (401 redirect + toast notifications + retries)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const config = error.config;
    const status = error.response?.status;

    // Log the error centrally
    logger.error(`API Error [${status || "NETWORK"}]: ${config?.url}`, {
      message: error.message,
      data: error.response?.data,
    });

    // 401 Unauthorized: Redirect to login
    if (status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        // Clear persistence data (Server handles cookie clearing via HttpOnly cookie)
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("goldenloft_")) {
            localStorage.removeItem(key);
          }
        });

        sessionStorage.clear();

        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Handle Retries for transient failures (5xx or Network Errors)
    // Only retry for idempotent methods (GET, HEAD, OPTIONS)
    if (
      config &&
      (status === undefined || (status >= 500 && status <= 599)) &&
      ["GET", "HEAD", "OPTIONS"].includes(config.method?.toUpperCase() || "")
    ) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount++;
        logger.warn(
          `Retrying request (${config._retryCount}/${MAX_RETRIES}): ${config.url}`,
        );

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return apiClient(config);
      }
    }

    // Global toast for API errors (can be disabled per-request with { skipToast: true })
    const skipToast = Boolean(config?.skipToast);
    if (typeof window !== "undefined" && !skipToast) {
      const message = getApiErrorMessage(error);
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
