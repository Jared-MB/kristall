import { applyDecorators, type Type } from "@nestjs/common";
import {
	ApiExtraModels,
	ApiResponse,
	type ApiResponseOptions,
	getSchemaPath,
} from "@nestjs/swagger";
import {
	ApiErrorResponseDto,
	ApiSuccessResponseDto,
} from "../dtos/api-response.dto";

/** A DTO class, or a primitive name for endpoints returning a scalar. */
type WrappedModel = Type<unknown> | "string" | "number" | "boolean";

type WrappedOptions = {
	/** Describe `data` as an array of `model` instead of a single object. */
	isArray?: boolean;
	/** `data` may come back as `null` (e.g. `findOne` misses). */
	nullable?: boolean;
	description?: string;
	status?: number;
};

/**
 * Documents an endpoint response as it actually leaves the server: the payload
 * nested inside the `TransformInterceptor` envelope.
 *
 * Pass no model for endpoints whose `data` has no dedicated DTO.
 */
export function ApiOkWrapped(
	model?: WrappedModel,
	{ isArray, nullable, description, status = 200 }: WrappedOptions = {},
) {
	const isDto = typeof model === "function";

	const modelSchema = isDto
		? { $ref: getSchemaPath(model) }
		: { type: model ?? ("object" as const) };

	const dataSchema = isArray
		? { type: "array" as const, items: modelSchema, nullable }
		: isDto
			? { allOf: [modelSchema], nullable }
			: { ...modelSchema, nullable };

	return applyDecorators(
		ApiExtraModels(
			...(isDto ? [ApiSuccessResponseDto, model] : [ApiSuccessResponseDto]),
		),
		ApiResponse({
			status,
			description,
			schema: {
				allOf: [
					{ $ref: getSchemaPath(ApiSuccessResponseDto) },
					{ properties: { data: dataSchema }, required: ["data"] },
				],
			},
		}),
	);
}

/**
 * Documents a failure response using the `HttpExceptionFilter` envelope.
 */
export function ApiErrorWrapped(
	status: number,
	description: string,
	options: Omit<ApiResponseOptions, "status" | "description" | "type"> = {},
) {
	return applyDecorators(
		ApiExtraModels(ApiErrorResponseDto),
		ApiResponse({
			...options,
			status,
			description,
			type: ApiErrorResponseDto,
		}),
	);
}
