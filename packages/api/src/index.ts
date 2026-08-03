export { APP_ROUTES, createAppClient } from "./app/index.ts";
export {
	AUTH_ROUTES,
	createAuthClient,
} from "./auth/index.ts";
export type {
	DailyResume,
	Incident,
	IncidentType,
	ModuleResume,
} from "./incidents/index.ts";
export {
	createIncidentsClient,
	INCIDENT_TYPES,
	INCIDENTS_ROUTES,
} from "./incidents/index.ts";
export {
	createLocationsClient,
	LOCATIONS_ROUTES,
	type Location,
} from "./locations/index.ts";
export { createShopClient, SHOP_ROUTES } from "./shop/index.ts";
export type { CreateClientConfig } from "./types/create-client-config.ts";
