import { ApiProperty } from "@nestjs/swagger";

export class LocationDto {
	@ApiProperty({ format: "uuid" })
	_id: string;

	@ApiProperty({ example: "Warehouse" })
	name: string;

	@ApiProperty({ description: "Address's location", nullable: true })
	address?: string;

	@ApiProperty({ description: "Phone's location", nullable: true })
	phone?: string;

	@ApiProperty({ format: "uuid" })
	shopId: string;
}
