import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * A validation failure attributed to a single input field.
 */
export class ApiFieldErrorDto {
	@ApiProperty({ example: "address" })
	field: string;

	@ApiProperty({ example: "Address must be between 5 and 75 characters" })
	message: string;
}

/**
 * Documents the envelope added by `TransformInterceptor` to every successful
 * response. The `data` property is described per endpoint by `ApiOkWrapped`.
 */
export class ApiSuccessResponseDto {
	@ApiProperty({ enum: ["ok"], example: "ok" })
	status: "ok";

	@ApiProperty({ example: 200 })
	statusCode: number;

	@ApiProperty({ example: "OK" })
	message: string;
}

/**
 * Documents the envelope built by `HttpExceptionFilter` for every failure.
 */
export class ApiErrorResponseDto {
	@ApiProperty({ enum: ["error"], example: "error" })
	status: "error";

	@ApiProperty({ example: 400 })
	statusCode: number;

	@ApiProperty({ example: "Invalid module" })
	message: string;

	@ApiProperty({
		description: "Error name, or the validation details when available",
		oneOf: [{ type: "string" }, { type: "object" }],
		example: "Bad Request",
	})
	error: Record<string, unknown> | string;

	@ApiPropertyOptional({
		description:
			"Present when the failure can be attributed to specific input fields",
		type: ApiFieldErrorDto,
		isArray: true,
	})
	fields?: ApiFieldErrorDto[];
}
