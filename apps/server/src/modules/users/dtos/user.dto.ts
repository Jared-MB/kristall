import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
	@ApiProperty({ format: "uuid" })
	_id: string;

	@ApiProperty({ format: "email", example: "owner@kristall.dev" })
	email: string;

	@ApiProperty({ example: "Jane Doe" })
	name: string;

	@ApiProperty({ enum: ["admin", "user"], example: "admin" })
	role: string;
}
