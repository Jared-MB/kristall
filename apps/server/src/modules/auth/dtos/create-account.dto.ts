import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAccountDto {
	@ApiProperty({ minLength: 6, example: "super-secret" })
	@IsString()
	@IsNotEmpty()
	password: string;

	@ApiProperty({ format: "uuid" })
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	userId: string;
}
