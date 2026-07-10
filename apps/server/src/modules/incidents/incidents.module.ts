import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IncidentsController } from "./controllers/incidents.controller";
import { Incident } from "./entities/incident.entity";
import { IncidentsService } from "./services/incidents.service";

@Module({
	imports: [TypeOrmModule.forFeature([Incident])],
	controllers: [IncidentsController],
	providers: [IncidentsService],
})
export class IncidentsModule {}
