import "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    /**
     * When true, the global API error toast will not be shown for this request.
     * Useful when the UI wants to handle errors locally.
     */
    skipToast?: boolean;
  }
}
