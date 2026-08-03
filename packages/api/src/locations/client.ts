import { createHttpClient } from "@kristall/http";
import type { CreateClientConfig } from "../types/create-client-config.ts";
import { LOCATIONS_ROUTES } from "./routes.ts";

/**
 * Builds a locations HTTP client bound to the shared LOCATIONS_ROUTES contract.
 *
 * The shop scope is resolved server-side from the auth token, so no shop id is
 * part of the contract; each app only injects transport concerns.
 */
export function createLocationsClient(config: CreateClientConfig) {
	return createHttpClient({
		serverUrl: config.serverUrl,
		routes: LOCATIONS_ROUTES,
		interceptors: {
			request: config.requestInterceptors ?? [],
			response: config.responseInterceptors ?? [],
		},
	});
}
