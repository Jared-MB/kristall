import { createShopClient } from "@kristall/api/shop";
import { env } from "@/constants/env.server";
import { authInterceptor } from "@/lib/interceptors/auth.interceptor";

export const shopClient = createShopClient({
	serverUrl: env.SERVER_URL,
	requestInterceptors: [authInterceptor],
});
