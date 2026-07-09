import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateShopDto {
	@IsString()
	@MinLength(5)
	@MaxLength(50)
	name: string;
}
