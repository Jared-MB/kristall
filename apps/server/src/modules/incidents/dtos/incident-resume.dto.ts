import { ApiProperty } from "@nestjs/swagger";
import { MODULES_ARRAY, type Modules } from "../../../common/types/modules";

export class ModuleResumeDto {
	@ApiProperty({
		enum: ["ERROR", "WARNING"],
		nullable: true,
		description: "`null` when the module behaved normally that day",
		example: null,
	})
	severity: "ERROR" | "WARNING" | null;

	@ApiProperty({
		example: "Operational",
		description:
			"One of: `No incidents`, `Operational`, `Service degraded`, `Service may be experiencing issues`",
	})
	message: string;

	@ApiProperty({ enum: MODULES_ARRAY, example: "auth" })
	module: Modules;
}

export class DailyResumeDto {
	@ApiProperty({ type: [ModuleResumeDto], description: "One entry per module" })
	incidents: ModuleResumeDto[];

	@ApiProperty({ format: "date", example: "2026-07-30" })
	day: string;
}

export class IncidentDto {
	@ApiProperty({ format: "uuid" })
	_id: string;

	@ApiProperty({ enum: MODULES_ARRAY, example: "auth" })
	module: Modules;

	@ApiProperty({ example: "testing" })
	action: string;

	@ApiProperty({ enum: ["INFO", "WARNING", "ERROR"], example: "INFO" })
	type: "INFO" | "WARNING" | "ERROR";

	@ApiProperty({
		type: "object",
		additionalProperties: true,
		nullable: true,
		example: null,
	})
	meta: Record<string, unknown> | null;

	@ApiProperty({ format: "date-time" })
	createdAt: Date;
}
