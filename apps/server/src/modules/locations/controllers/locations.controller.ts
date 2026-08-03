import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	ApiErrorWrapped,
	ApiOkWrapped,
} from "../../../common/decorators/api-response.decorator";
import { ShopId } from "../../auth/decorators/shop-id.decorator";
import { CreateLocationDto } from "../dtos/create-location.dto";
import { LocationDto } from "../dtos/location.dto";
import { UpdateLocationDto } from "../dtos/update-location.dto";
import { LocationsService } from "../services/locations.service";

@ApiTags("locations")
@ApiBearerAuth("bearer")
@Controller("locations")
export class LocationsController {
	constructor(private readonly locationsService: LocationsService) {}

	@Get()
	@ApiOperation({ summary: "Locations of the authenticated user's shop" })
	@ApiOkWrapped(LocationDto, { isArray: true })
	@ApiErrorWrapped(401, "Missing or invalid token")
	@ApiErrorWrapped(403, "The token has no shop attached")
	public async getLocationsByShopId(@ShopId() shopId: string) {
		const locations = await this.locationsService.findAllByShop(shopId);
		return locations;
	}

	@Get(":id")
	public async getLocationById(
		@Param("id") id: string,
		@ShopId() shopId: string,
	) {
		const location = await this.locationsService.findOneByShop(shopId, id);
		return location;
	}

	@Post()
	@ApiOperation({
		summary: "Create a location",
		description: "The location is attached to the shop found in the token.",
	})
	@ApiBody({ type: CreateLocationDto })
	@ApiOkWrapped(LocationDto, { status: 201 })
	@ApiErrorWrapped(400, "Invalid payload")
	@ApiErrorWrapped(401, "Missing or invalid token")
	@ApiErrorWrapped(403, "The token has no shop attached")
	public async createLocation(
		@Body() body: CreateLocationDto,
		@ShopId() shopId: string,
	) {
		const newLocation = this.locationsService.createOne(shopId, {
			name: body.name,
			address: body.address,
			phone: body.phone,
		});
		const savedLocation = await this.locationsService.saveOne(newLocation);
		return savedLocation;
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Update a location",
		description:
			"Overwrites every detail of a location belonging to the shop found in the token.",
	})
	@ApiBody({ type: UpdateLocationDto })
	@ApiOkWrapped(LocationDto)
	@ApiErrorWrapped(400, "Invalid payload")
	@ApiErrorWrapped(401, "Missing or invalid token")
	@ApiErrorWrapped(403, "The token has no shop attached")
	@ApiErrorWrapped(404, "The shop has no location with that id")
	public async updateLocation(
		@Param("id") id: string,
		@Body() body: UpdateLocationDto,
		@ShopId() shopId: string,
	) {
		const updatedLocation = await this.locationsService.updateOne(shopId, id, {
			name: body.name,
			address: body.address,
			phone: body.phone,
		});
		return updatedLocation;
	}
}
