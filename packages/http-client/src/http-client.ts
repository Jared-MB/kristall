import { ZodType, type z } from "zod";
import { GET, PATCH, POST } from "./http";
import type {
	HttpMutationOptions,
	HttpOptions,
	HttpResult,
	Interceptors,
	ParamValues,
	RequiresOptions,
	Route,
	SlugValues,
} from "./types";
import { buildUrl } from "./utils/build-url";

type RouteDefs = Record<string, Route>;

type QueryOptions<R extends Route> = Omit<HttpOptions, "serverUrl" | "slugs"> &
	ParamValues<R> &
	SlugValues<R>;

type MutationOptions<R extends Route> = Omit<
	HttpMutationOptions<R["apiPayload"]>,
	"serverUrl" | "slugs"
> &
	ParamValues<R> &
	SlugValues<R>;

type OptionsArg<R extends Route, O> =
	RequiresOptions<R> extends true ? [options: O] : [options?: O];

export function createHttpClient<Routes extends RouteDefs>(config: {
	serverUrl: string | undefined;
	routes: Routes;
	interceptors?: Interceptors;
}): {
	GET: <U extends keyof Routes>(
		alias: U,
		...args: OptionsArg<Routes[U], QueryOptions<Routes[U]>>
	) => Promise<HttpResult<Routes[U]["returns"]>>;

	POST: <U extends keyof Routes>(
		alias: U,
		body: Routes[U]["apiPayload"] extends z.ZodTypeAny
			? z.infer<Routes[U]["apiPayload"]>
			: unknown,
		...args: OptionsArg<Routes[U], MutationOptions<Routes[U]>>
	) => Promise<HttpResult<Routes[U]["returns"]>>;

	PATCH: <U extends keyof Routes>(
		alias: U,
		body: Routes[U]["apiPayload"] extends z.ZodTypeAny
			? z.infer<Routes[U]["apiPayload"]>
			: unknown,
		...args: OptionsArg<Routes[U], MutationOptions<Routes[U]>>
	) => Promise<HttpResult<Routes[U]["returns"]>>;
};

// IMPLEMENTATION
export function createHttpClient<Routes extends RouteDefs>({
	serverUrl,
	routes,
	interceptors,
}: {
	serverUrl: string | undefined;
	routes: Routes;
	interceptors?: Interceptors;
}) {
	const getParsedURL = (alias: string, options: Record<string, any> = {}) => {
		const route = routes[alias];
		const { params = {}, slugs = {} } = options;

		const parsedParams =
			route.params instanceof ZodType
				? route.params.parse(params)
				: params;

		const parsedSlugs =
			route.slugs instanceof ZodType ? route.slugs.parse(slugs) : slugs;

		return buildUrl(route.url, parsedParams as any, parsedSlugs as any);
	};

	/**
	 * `params` and `slugs` are already baked into the url, so they are not
	 * forwarded to the underlying primitives.
	 */
	const getRequestOptions = ({ params, slugs, ...rest }: any = {}) => ({
		...rest,
		serverUrl,
		interceptors,
	});

	const get = async (alias: string, ...args: any[]) => {
		const options = args[0];
		return GET(getParsedURL(alias, options), getRequestOptions(options));
	};

	const post = async (alias: string, body: any, options: any) => {
		return POST(getParsedURL(alias, options), body, {
			...getRequestOptions(options),
			apiPayload: routes[alias]?.apiPayload,
		});
	};

	const patch = async (alias: string, body: any, options: any) => {
		return PATCH(getParsedURL(alias, options), body, {
			...getRequestOptions(options),
			apiPayload: routes[alias]?.apiPayload,
		});
	};

	return { GET: get, POST: post, PATCH: patch } as any;
}
