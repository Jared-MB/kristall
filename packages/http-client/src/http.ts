import { serialize } from "object-to-formdata";
import type { z } from "zod";
import type {
	HttpMutationOptions,
	HttpOptions,
	HttpRequest,
	RequestInterceptor,
} from "./types";
import { resolveSlugs } from "./utils/build-url";
import { getHeaders } from "./utils/get-headers";
import { handleResponse } from "./utils/handle-response";

async function executeRequest<T>(
	method: HttpRequest["method"],
	url: `/${string}`,
	options: any,
	body?: BodyInit | null,
) {
	const headers = getHeaders({
		bodyType: options?.bodyType ?? "json",
	});

	if (!options.serverUrl) {
		throw new Error(
			`Server URL is not defined for **${method}** request on **${url}**`,
		);
	}

	// No-op when the url has already been resolved by `createHttpClient`
	const path = resolveSlugs(url, options?.slugs);

	const server = `${options.serverUrl}${path}`;

	let request: HttpRequest = {
		url: server,
		method,
		headers,
		body,
	};

	if (options?.interceptors?.request) {
		for (const interceptor of options.interceptors
			.request as RequestInterceptor[]) {
			request = await interceptor(request, request, options);
		}
	}

	if ((options?.auth ?? true) && !request.headers.get("Authorization")) {
		throw new Error(
			`**${method}** request on **${url}** was set as authenticated but no **Authorization** header was found`,
		);
	}

	if (options?.auth === false) {
		request.headers.delete("Authorization");
	}

	const fetchPromise = fetch(request.url, {
		method: request.method,
		headers: request.headers,
		body: request.body,
	});

	return handleResponse<T>(fetchPromise, {
		responseInterceptors: options.interceptors?.response,
		context: request,
	});
}

export async function GET<T>(
	url: `/${string}`,
	options: Omit<HttpOptions, "bodyType">,
) {
	return executeRequest<T>("GET", url, options);
}

async function mutate<T, ApiPayload extends z.ZodType | undefined = undefined>(
	method: "POST" | "PATCH",
	url: `/${string}`,
	body: ApiPayload extends z.ZodTypeAny ? z.infer<ApiPayload> : unknown,
	options: HttpMutationOptions<ApiPayload> = {},
) {
	const bodyType = options?.bodyType ?? "json";

	let requestBody: any = body;
	const parsedData = options?.apiPayload?.safeParse(body);

	if (parsedData !== undefined && !parsedData?.success) {
		return [parsedData?.error, null] as const;
	}

	if (parsedData?.success) {
		requestBody = parsedData.data;
	}

	const serializedBody =
		bodyType === "json"
			? JSON.stringify(requestBody)
			: serialize(requestBody);

	return executeRequest<T>(method, url, options, serializedBody);
}

export async function POST<
	T,
	ApiPayload extends z.ZodType | undefined = undefined,
>(
	url: `/${string}`,
	body: ApiPayload extends z.ZodTypeAny ? z.infer<ApiPayload> : unknown,
	options: HttpMutationOptions<ApiPayload> = {},
) {
	return mutate<T, ApiPayload>("POST", url, body, options);
}

export async function PATCH<
	T,
	ApiPayload extends z.ZodType | undefined = undefined,
>(
	url: `/${string}`,
	body: ApiPayload extends z.ZodTypeAny ? z.infer<ApiPayload> : unknown,
	options: HttpMutationOptions<ApiPayload> = {},
) {
	return mutate<T, ApiPayload>("PATCH", url, body, options);
}
