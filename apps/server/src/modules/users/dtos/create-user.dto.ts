import { IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsEnum(["admin", "user"])
	role: string;

	@IsUUID()
	shopId: string;
}
