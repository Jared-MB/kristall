import { createLocationsClient } from "@kristall/api/locations";
import { env } from "@/constants/env.server";
import { authInterceptor } from "@/lib/interceptors/auth.interceptor";

export const locationsClient = createLocationsClient({
  serverUrl: env.SERVER_URL,
  requestInterceptors: [authInterceptor],
});
