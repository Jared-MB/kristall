import { Controller, Get, Req } from "@nestjs/common";
import type { AuthRequest } from "../../../common/types/request";
import { ShopsService } from "../services/shops.service";

@Controller("shop")
export class ShopController {
	constructor(private readonly shopService: ShopsService) {}

	@Get()
	public async getShopByUserId(@Req() req: AuthRequest) {
		return this.shopService.getOneByUserId(req.user.userId);
	}
}
