import { createAuthClient } from "@kristall/api/auth";
import { env } from "@/constants/env.server";
import { authInterceptor } from "@/lib/interceptors/auth.interceptor";
import { loggerRequestInterceptor } from "@/lib/interceptors/logger.interceptor";

export const authClient = createAuthClient({
	serverUrl: env.SERVER_URL,
	requestInterceptors: [authInterceptor, loggerRequestInterceptor],
});
