import { ApiProperty } from "@nestjs/swagger";

/**
 * Shape attached to the request by `JwtStrategy` once the token is validated.
 */
export class TokenPayloadDto {
	@ApiProperty({ format: "uuid" })
	userId: string;

	@ApiProperty({ example: "Jane Doe" })
	name: string;

	@ApiProperty({
		format: "uuid",
		nullable: true,
		description: "Tienda a la que pertenece el usuario",
	})
	shopId: string | null;
}
