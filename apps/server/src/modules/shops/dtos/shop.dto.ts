import { ApiProperty } from "@nestjs/swagger";

export class ShopDto {
	@ApiProperty({ format: "uuid" })
	_id: string;

	@ApiProperty({ example: "Kristall Store" })
	name: string;
}
