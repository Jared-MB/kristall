import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateLocationDto {
	@ApiProperty({ minLength: 5, maxLength: 50, example: "Warehouse" })
	@IsString()
	@MinLength(5)
	@MaxLength(50)
	name: string;

	@ApiProperty({
		nullable: true,
	})
	@IsOptional()
	@IsString()
	address?: string;

	@ApiProperty({
		nullable: true,
	})
	@IsOptional()
	@IsString()
	phone?: string;
}
