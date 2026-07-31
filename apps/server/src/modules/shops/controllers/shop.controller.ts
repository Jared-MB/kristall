import { Controller, Get, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	ApiErrorWrapped,
	ApiOkWrapped,
} from "../../../common/decorators/api-response.decorator";
import type { AuthRequest } from "../../../common/types/request";
import { ShopDto } from "../dtos/shop.dto";
import { ShopsService } from "../services/shops.service";

@ApiTags("shop")
@ApiBearerAuth("bearer")
@Controller("shop")
export class ShopController {
	constructor(private readonly shopService: ShopsService) {}

	@Get()
	@ApiOperation({ summary: "Shop the authenticated user belongs to" })
	@ApiOkWrapped(ShopDto, {
		nullable: true,
		description: "`data` is `null` when the user has no shop",
	})
	@ApiErrorWrapped(401, "Missing or invalid token")
	public async getShopByUserId(@Req() req: AuthRequest) {
		return this.shopService.getOneByUserId(req.user.userId);
	}
}
