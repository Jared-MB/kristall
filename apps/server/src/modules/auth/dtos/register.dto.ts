import { ApiProperty } from "@nestjs/swagger";
import { ShopDto } from "../../shops/dtos/shop.dto";
import { UserDto } from "../../users/dtos/user.dto";

export class RegisterUserDto {
	@ApiProperty({ format: "email", example: "owner@kristall.dev" })
	email: string;

	@ApiProperty({ example: "Jane Doe" })
	name: string;

	@ApiProperty({ enum: ["admin", "user"], example: "admin" })
	role: string;
}

export class RegisterAccountDto {
	@ApiProperty({ minLength: 6, example: "super-secret" })
	password: string;
}

export class RegisterShopDto {
	@ApiProperty({ minLength: 5, maxLength: 50, example: "Kristall Store" })
	name: string;
}

/**
 * Registration creates the shop, its first user and the account in a single
 * transaction, so the body carries the three of them.
 */
export class RegisterDto {
	@ApiProperty({ type: RegisterUserDto })
	user: RegisterUserDto;

	@ApiProperty({ type: RegisterAccountDto })
	account: RegisterAccountDto;

	@ApiProperty({ type: RegisterShopDto })
	shop: RegisterShopDto;
}

class RegisteredAccountDto {
	@ApiProperty({ format: "uuid" })
	_id: string;

	@ApiProperty({ description: "Argon2 hash of the submitted password" })
	password: string;
}

export class RegisterResponseDto {
	@ApiProperty({ type: UserDto })
	user: UserDto;

	@ApiProperty({ type: RegisteredAccountDto })
	account: RegisteredAccountDto;

	@ApiProperty({ type: ShopDto })
	shop: ShopDto;
}
