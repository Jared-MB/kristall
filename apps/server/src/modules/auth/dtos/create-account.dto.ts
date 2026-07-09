import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAccountDto {
	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	userId: string;
}
