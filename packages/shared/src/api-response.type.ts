interface ApiResponseBase {
	statusCode: number;
	message: string;
}

export interface ApiSuccessResponse<T> extends ApiResponseBase {
	status: "ok";
	data: T;
}

export interface ApiErrorResponse extends ApiResponseBase {
	status: "error";
	error: Record<string, unknown> | string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
