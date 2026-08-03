import { MODULES_ARRAY, type Modules } from "@kristall/shared";
import {
	BadRequestException,
	Controller,
	Get,
	NotFoundException,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
	ApiErrorWrapped,
	ApiOkWrapped,
} from "../../../common/decorators/api-response.decorator";
import { Public } from "../../auth/decorators/public.decorator";
import { DailyResumeDto, IncidentDto } from "../dtos/incident-resume.dto";
import type { Incident } from "../entities/incident.entity";
import { IncidentsService } from "../services/incidents.service";

@ApiTags("incidents")
@Controller("incidents")
export class IncidentsController {
	constructor(private readonly incidentsService: IncidentsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: "Per-module health resume for the last 7 days",
		description:
			"Returns one entry per day (most recent first) with the severity of every module, derived from the incidents recorded that day.",
	})
	@ApiOkWrapped(DailyResumeDto, { isArray: true })
	public getLastIncidentsResume() {
		return this.incidentsService.getLastIncidentResume();
	}

	@Public()
	@ApiOperation({
		summary: "Create an incidents record based on given `module` and `type`",
		description:
			"Development only: responds with 404 in any other environment.",
	})
	@ApiQuery({ name: "module", enum: MODULES_ARRAY })
	@ApiQuery({ name: "type", enum: ["INFO", "WARNING", "ERROR"] })
	@ApiOkWrapped(IncidentDto)
	@ApiErrorWrapped(400, "Invalid `module` or `type`")
	@ApiErrorWrapped(404, "Not running in development")
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
