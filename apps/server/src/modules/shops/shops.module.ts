import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ShopController } from "./controllers/shop.controller";
import { Shop } from "./entities/shop.entity";
import { ShopsService } from "./services/shops.service";

@Module({
	imports: [TypeOrmModule.forFeature([Shop])],
	providers: [ShopsService],
	exports: [ShopsService],
	controllers: [ShopController],
})
export class ShopsModule {}
