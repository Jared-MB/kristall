import type { z } from "zod";

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type Route = {
	url: `/${string}`;
	/**
	 * Data schema to be send from Client (UI) to Server Function
	 *
	 * Mostly used in `.inputValidator()` server functions
	 */
	clientInput?: z.ZodType;
	/**
	 * Request body schema to be send from Server Function to an External API
	 */
	apiPayload?: z.ZodType;
	/**
	 * Schema for the dynamic segments of `url`
	 *
	 * Keys must match the segment name without the colon:
	 * `url: "/locations/:id"` → `slugs: z.object({ id: z.string() })`
	 */
	slugs?: z.ZodType;
	params?: z.ZodType;
	returns?: unknown;
};

export interface ServerRoutes {
	[key: string]: Route;
}

export interface Interceptors {
	request?: ((
		request: HttpRequest,
		context: HttpRequest,
		options: Omit<HttpOptions, "interceptors">,
	) => Promise<HttpRequest> | HttpRequest)[];
	response?: ((
		response: Response,
		context: HttpRequest,
	) => Promise<Response> | Response)[];
}

export type RequestInterceptor = NonNullable<Interceptors["request"]>[number];
export type ResponseInterceptor = NonNullable<Interceptors["response"]>[number];

export interface HttpRequest {
	url: string;
	method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
	headers: Headers;
	body?: BodyInit | null;
}

export type HttpResult<T> = readonly [Error, null] | readonly [null, T];

export interface HttpOptions {
	auth?: boolean;
	serverUrl?: string;
	interceptors?: Interceptors;
	/**
	 * Values for the dynamic segments of the url — `/locations/:id` with
	 * `{ id: "abc" }` resolves to `/locations/abc`
	 */
	slugs?: Record<string, string | number>;
}

export interface HttpMutationOptions<ApiPayload extends z.ZodType | undefined>
	extends HttpOptions {
	bodyType?: "json" | "form-data";
	apiPayload?: ApiPayload;
}

/**
 * Values accepted for a route's dynamic segments, inferred from its `slugs` schema
 */
export type SlugValues<R extends Route> = undefined extends R["slugs"]
	? { slugs?: never }
	: { slugs: z.infer<NonNullable<R["slugs"]>> };

/**
 * Values accepted for a route's query string, inferred from its `params` schema
 */
export type ParamValues<R extends Route> = undefined extends R["params"]
	? { params?: never }
	: { params: z.infer<NonNullable<R["params"]>> };

/**
 * `true` when the route declares `params` or `slugs`, making the options
 * argument mandatory at the call site
 */
export type RequiresOptions<R extends Route> = undefined extends R["params"]
	? undefined extends R["slugs"]
		? false
		: true
	: true;
