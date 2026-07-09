import { createHttpClient } from "@kristall/http";
import type { CreateClientConfig } from "../types/create-client-config.ts";
import { SHOP_ROUTES } from "./routes.ts";

export function createShopClient(config: CreateClientConfig) {
	return createHttpClient({
		serverUrl: config.serverUrl,
		routes: SHOP_ROUTES,
		interceptors: {
			request: config.requestInterceptors ?? [],
			response: config.responseInterceptors ?? [],
		},
	});
}
