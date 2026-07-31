import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiOkWrapped } from "./common/decorators/api-response.decorator";
import { Public } from "./modules/auth/decorators/public.decorator";

@ApiTags("health")
@Controller()
export class AppController {
	@Public()
	@Get("health")
	@ApiOperation({ summary: "Liveness probe" })
	@ApiOkWrapped("string", { description: '`data` is always `"Healthy"`' })
	getHealth(): string {
		return "Healthy";
	}
}
