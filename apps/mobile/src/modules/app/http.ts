import { createAppClient } from "@kristall/api/app";
import { authInterceptor } from "@/lib/interceptors/auth.interceptor";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

if (!serverUrl) {
	throw new Error("EXPO_PUBLIC_SERVER_URL is not defined");
}

export const appClient = createAppClient({
	serverUrl,
	requestInterceptors: [authInterceptor],
});
