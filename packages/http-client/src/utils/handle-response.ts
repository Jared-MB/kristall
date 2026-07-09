import { tryCatch } from "@kristall/try-catch";
import { exceptionHandler } from "../exceptions/exception-handler";
import type { HttpRequest, HttpResult, ResponseInterceptor } from "../types";

export async function handleResponse<T>(
	responsePromise: Promise<Response>,
	options: {
		responseInterceptors?: ResponseInterceptor[];
		context: HttpRequest;
	},
): Promise<HttpResult<T>> {
	const [fetchError, requestResponse] = await tryCatch(responsePromise);

	if (fetchError) {
		return [fetchError, null] as const;
	}

	let response = requestResponse;

	if (options?.responseInterceptors) {
		for (const interceptor of options.responseInterceptors) {
			response = await interceptor(response, options.context);
		}
	}

	try {
		exceptionHandler(response);
	} catch (error) {
		if (error instanceof Error) {
			return [error, null] as const;
		}
	}

	const [textError, text] = await tryCatch(response.text());

	if (textError) {
		return [textError, null] as const;
	}

	let data: any;

	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		// If it's not valid JSON, we return the raw text as the error,
		// mirroring the previous fallback behavior without reading the stream twice.
		return [new Error(text), null] as const;
	}

	const result = data as T;

	return [null, result] as const;
}
