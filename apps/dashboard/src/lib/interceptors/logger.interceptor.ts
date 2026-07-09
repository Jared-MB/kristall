import type { RequestInterceptor, ResponseInterceptor } from "@kristall/http";

export const loggerResponseInterceptor: ResponseInterceptor = (
	response,
	ctx,
) => {
	console.log(`[${ctx.method}] [${response.status}] ${ctx.url}`);

	return response;
};

export const loggerRequestInterceptor: RequestInterceptor = (request, ctx) => {
	console.log(`[LOGGER] [${ctx.method}] [${ctx.url}]`);

	return request;
};
