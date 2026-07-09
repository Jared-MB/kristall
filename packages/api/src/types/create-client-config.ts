import type { RequestInterceptor, ResponseInterceptor } from "@kristall/http";

export interface CreateClientConfig {
	/** Base URL of the API server (each app injects its own env). */
	serverUrl: string;
	/** Platform-specific request interceptors (auth token, logging, ...). */
	requestInterceptors?: RequestInterceptor[];
	/** Platform-specific response interceptors. */
	responseInterceptors?: ResponseInterceptor[];
}
