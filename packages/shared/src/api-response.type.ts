interface ApiResponseBase {
	statusCode: number;
	message: string;
}

export interface ApiSuccessResponse<T> extends ApiResponseBase {
	status: "ok";
	data: T;
}

/** A validation failure attached to a single input field. */
export interface ApiFieldError {
	field: string;
	message: string;
}

export interface ApiErrorResponse extends ApiResponseBase {
	status: "error";
	error: Record<string, unknown> | string;
	/**
	 * Present when the failure can be attributed to specific input fields.
	 * `message` stays a human readable summary of the same errors.
	 */
	fields?: ApiFieldError[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
