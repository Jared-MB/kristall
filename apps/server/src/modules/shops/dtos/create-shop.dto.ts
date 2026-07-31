import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateShopDto {
	@ApiProperty({ minLength: 5, maxLength: 50, example: "Kristall Store" })
	@IsString()
	@MinLength(5)
	@MaxLength(50)
	name: string;
}
