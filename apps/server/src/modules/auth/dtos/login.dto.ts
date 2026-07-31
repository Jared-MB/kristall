import { ApiProperty } from "@nestjs/swagger";

/**
 * Credentials consumed by `LocalStrategy`. Kept documentation-only: the guard
 * reads the raw body before any pipe runs.
 */
export class LoginDto {
	@ApiProperty({ format: "email", example: "owner@kristall.dev" })
	email: string;

	@ApiProperty({ minLength: 6, example: "super-secret" })
	password: string;
}

export class LoginResponseDto {
	@ApiProperty({
		description: "JWT to send as `Authorization: Bearer <token>`",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	access_token: string;
}
