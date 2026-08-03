import type { HttpMutationOptions } from "../types";

interface HeaderOptions {
	bodyType?: HttpMutationOptions<undefined>["bodyType"];
}

export function getHeaders(options?: HeaderOptions) {
	const headers = new Headers();

	if (options?.bodyType === "json") {
		headers.set("Content-Type", "application/json");
	}

	return headers;
}
