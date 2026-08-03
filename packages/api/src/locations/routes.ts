import type { ServerRoutes } from "@kristall/http";
import type { ApiResponse } from "@kristall/shared";
import { z } from "zod";

const CreateLocationSchema = z.object({
	name: z.string().min(5).max(50),
	address: z.string().optional(),
	phone: z.string().optional(),
});

export interface Location {
	_id: string;
	name: string;
	shopId: string;
	address?: string;
	phone?: string;
}

export const LOCATIONS_ROUTES = {
	"get-locations": {
		url: "/locations",
		returns: {} as ApiResponse<Location[]>,
	},
	"get-location-by-id": {
		url: "/locations/:id",
		slugs: z.object({
			id: z.string(),
		}),
		returns: {} as ApiResponse<Location | null>,
	},
	"create-location": {
		url: "/locations",
		clientInput: CreateLocationSchema,
		apiPayload: CreateLocationSchema,
		returns: {} as ApiResponse<Location>,
	},
	/** The edit form resubmits every field, so the payload mirrors creation. */
	"update-location": {
		url: "/locations/:id",
		slugs: z.object({
			id: z.string(),
		}),
		clientInput: CreateLocationSchema,
		apiPayload: CreateLocationSchema,
		returns: {} as ApiResponse<Location>,
	},
} satisfies ServerRoutes;
