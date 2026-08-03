import { MODULES_ARRAY, type Modules } from "@kristall/shared";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DateTime } from "luxon";
import { Between, type Repository } from "typeorm";
import { Incident } from "../entities/incident.entity";

@Injectable()
export class IncidentsService {
	constructor(
		@InjectRepository(Incident)
		private readonly incidentsRepository: Repository<Incident>,
	) {}

	public async create({
		module,
		type,
		action,
		meta,
	}: {
		module: Modules;
		type: Incident["type"];
		action: string;
		meta?: Record<string, unknown>;
	}) {
		const incident = this.incidentsRepository.create({
			module,
			action,
			type,
			meta,
		});
		return this.incidentsRepository.save(incident);
	}

	public async getLastIncidentResume(daysAgo: number = 7) {
		const days = Array.from({ length: daysAgo }).map((_, i) => {
			return DateTime.now().minus({ days: i }).toFormat("yyyy-MM-dd");
		});

		const resumePromises = days.map(async (day) => {
			return {
				incidents: await Promise.all(
					MODULES_ARRAY.map(
						async (module) => await this.getResumeByModule(module, day),
					),
				),
				day,
			};
		});

		return Promise.all(resumePromises);
	}

	private async getResumeByModule(module: Modules, date: string) {
		const zone = "America/Mexico_City";

		const startOfDay = DateTime.fromISO(date, { zone })
			.startOf("day")
			.toJSDate();
		const endOfDay = DateTime.fromISO(date, { zone }).endOf("day").toJSDate();

		const incidents = await this.incidentsRepository.find({
			where: {
				module,
				createdAt: Between(startOfDay, endOfDay),
			},
			order: {
				createdAt: "DESC",
			},
		});

		if (incidents.length === 0) {
			return { severity: null, message: "No incidents", module };
		}

		const counts = incidents.reduce(
			(acc, { type }) => {
				acc[type]++;
				return acc;
			},
			{ ERROR: 0, WARNING: 0, INFO: 0 },
		);

		if (counts.ERROR >= 3) {
			return {
				severity: "ERROR",
				message: "Service may be experiencing issues",
				module,
			};
		}

		if (counts.WARNING >= 5) {
			return { severity: "WARNING", message: "Service degraded", module };
		}

		return { severity: null, message: "Operational", module };
	}
}
