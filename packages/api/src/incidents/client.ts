import { createHttpClient } from "@kristall/http";
import type { CreateClientConfig } from "../types/create-client-config.ts";
import { INCIDENTS_ROUTES } from "./routes.ts";

/**
 * Builds an incidents HTTP client bound to the shared INCIDENTS_ROUTES contract.
 *
 * Both routes are public on the server, so no auth is part of the contract;
 * each app only injects transport concerns.
 */
export function createIncidentsClient(config: CreateClientConfig) {
	return createHttpClient({
		serverUrl: config.serverUrl,
		routes: INCIDENTS_ROUTES,
		interceptors: {
			request: config.requestInterceptors ?? [],
			response: config.responseInterceptors ?? [],
		},
	});
}
