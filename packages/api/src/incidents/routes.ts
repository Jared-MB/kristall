import type { ServerRoutes } from "@kristall/http";
import { type ApiResponse, MODULES_ARRAY, type Modules } from "@kristall/shared";
import { z } from "zod";

export const INCIDENT_TYPES = ["INFO", "WARNING", "ERROR"] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];

const CreateTestIncidentSchema = z.object({
	module: z.enum(MODULES_ARRAY),
	type: z.enum(INCIDENT_TYPES),
});

export interface Incident {
	_id: string;
	module: Modules;
	action: string;
	type: IncidentType;
	meta: Record<string, unknown> | null;
	createdAt: string;
}

export interface ModuleResume {
	/** `null` when the module behaved normally that day. */
	severity: "ERROR" | "WARNING" | null;
	/** `No incidents`, `Operational`, `Service degraded` or `Service may be experiencing issues`. */
	message: string;
	module: Modules;
}

export interface DailyResume {
	/** One entry per module. */
	incidents: ModuleResume[];
	/** `yyyy-MM-dd`. */
	day: string;
}

export const INCIDENTS_ROUTES = {
	"get-incidents-resume": {
		url: "/incidents",
		returns: {} as ApiResponse<DailyResume[]>,
	},
	"create-test-incident": {
		url: "/incidents/create-test",
		params: CreateTestIncidentSchema,
		returns: {} as ApiResponse<Incident>,
	},
} satisfies ServerRoutes;
