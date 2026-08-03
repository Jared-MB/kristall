import type { ApiFieldError } from "@kristall/shared";
import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Location } from "../entities/location.entity";

interface LocationDetails {
	name: string;
	address?: string;
	phone?: string;
}

/**
 * An optional field submitted empty clears the column. The entity types these
 * as `string` so `emitDecoratorMetadata` can reflect their type, which is what
 * the cast papers over.
 */
function nullable(value: string | undefined) {
	return (value || null) as unknown as string;
}

@Injectable()
export class LocationsService {
	constructor(
		@InjectRepository(Location)
		private readonly locationRepository: Repository<Location>,
	) {}

	public findAllByShop(shopId: string) {
		return this.locationRepository.findBy({ shopId });
	}

	public findOneByShop(shopId: string, locationId: string) {
		return this.locationRepository.findOneBy({ _id: locationId, shopId });
	}

	/**
	 * @throws Error
	 */
	public createOne(shopId: string, params: LocationDetails) {
		this.assertValidDetails(params);

		return this.locationRepository.create({
			shopId,
			name: params.name,
			address: params.address || undefined,
			phone: params.phone || undefined,
		});
	}

	/**
	 * Overwrites every detail of a location the shop owns. Optional fields left
	 * empty are cleared, mirroring what the edit form submits.
	 *
	 * @throws Error
	 */
	public async updateOne(
		shopId: string,
		locationId: string,
		params: LocationDetails,
	) {
		this.assertValidDetails(params);

		const location = await this.findOneByShop(shopId, locationId);

		if (!location) {
			throw new NotFoundException("Location not found");
		}

		location.name = params.name;
		location.address = nullable(params.address);
		location.phone = nullable(params.phone);

		return this.saveOne(location);
	}

	public saveOne(location: Location) {
		return this.locationRepository.save(location);
	}

	/**
	 * Length rules the shared schema cannot express for optional fields, so an
	 * empty submission stays valid while a filled one must be within range.
	 *
	 * @throws BadRequestException
	 */
	private assertValidDetails(params: LocationDetails) {
		const fields: ApiFieldError[] = [];

		if (
			params.address &&
			(params.address.length < 5 || params.address.length > 75)
		) {
			fields.push({
				field: "address",
				message: "Address must be between 5 and 75 characters",
			});
		}

		if (params.phone && (params.phone.length < 5 || params.phone.length > 15)) {
			fields.push({
				field: "phone",
				message: "Phone must be between 5 and 15 characters",
			});
		}

		if (fields.length > 0) {
			throw new BadRequestException({ message: "Invalid payload", fields });
		}
	}
}
