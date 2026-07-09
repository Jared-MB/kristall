import type { ServerRoutes } from "@kristall/http";
import type { ApiResponse } from "@kristall/shared";

export const SHOP_ROUTES = {
	"get-shop": {
		url: "/shop",
		returns: {} as ApiResponse<{
			_id: string;
			name: string;
		}>,
	},
} satisfies ServerRoutes;
