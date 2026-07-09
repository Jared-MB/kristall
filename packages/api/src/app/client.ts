import { createHttpClient } from "@kristall/http";
import type { CreateClientConfig } from "../types/create-client-config.ts";
import { APP_ROUTES } from "./routes.ts";

/**
 * Builds an auth HTTP client bound to the shared AUTH_ROUTES contract.
 *
 * The routes/schemas are portable; the transport concerns (where the server
 * lives, how the token is attached) are injected by each app so the same
 * contract works from Next.js server actions and from React Native.
 */
export function createAppClient(config: CreateClientConfig) {
	return createHttpClient({
		serverUrl: config.serverUrl,
		routes: APP_ROUTES,
		interceptors: {
			request: config.requestInterceptors ?? [],
			response: config.responseInterceptors ?? [],
		},
	});
}
