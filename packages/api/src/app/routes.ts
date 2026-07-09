import type { ServerRoutes } from "@kristall/http";
import type { ApiResponse } from "@kristall/shared";

export const APP_ROUTES = {
	health: {
		url: "/health",
		returns: {} as ApiResponse<"Healthy">,
	},
} satisfies ServerRoutes;
