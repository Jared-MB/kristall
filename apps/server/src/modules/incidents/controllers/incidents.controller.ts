import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Query,
} from "@nestjs/common";
import { MODULES_ARRAY, type Modules } from "../../../common/types/modules";
import { Public } from "../../auth/decorators/public.decorator";
import type { Incident } from "../entities/incident.entity";
import { IncidentsService } from "../services/incidents.service";

@Controller("incidents")
export class IncidentsController {
	constructor(private readonly incidentsService: IncidentsService) {}

	@Public()
	@Get()
	public getLastIncidentsResume() {
		return this.incidentsService.getLastIncidentResume();
	}

	@Public()
	@Get("create-test")
	public createTest(
		@Query("module") module: Modules,
		@Query("type") type: Incident["type"],
	) {
		if (process.env.NODE_ENV !== "development")
			throw new NotFoundException("Cannot GET /incidents/create");

		if (!MODULES_ARRAY.includes(module))
			throw new BadRequestException("Invalid module");
		if (type !== "INFO" && type !== "WARNING" && type !== "ERROR")
			throw new BadRequestException("Invalid type");

		return this.incidentsService.create({ module, type, action: "testing" });
	}
}
