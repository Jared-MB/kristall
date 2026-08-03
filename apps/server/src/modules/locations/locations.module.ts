import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationsController } from "./controllers/locations.controller";
import { Location } from "./entities/location.entity";
import { LocationsService } from "./services/locations.service";

@Module({
	imports: [TypeOrmModule.forFeature([Location])],
	controllers: [LocationsController],
	providers: [LocationsService],
})
export class LocationsModule {}
