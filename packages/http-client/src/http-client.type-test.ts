/**
 * Compile-time assertions for the client call signatures — verified by
 * `pnpm check-types`, never executed. Every `@ts-expect-error` below fails the
 * type check if the call stops being an error.
 */

import { z } from "zod";
import { createHttpClient } from "./http-client";
import type { ServerRoutes } from "./types";

const routes = {
	plain: { url: "/users", returns: {} as { id: string }[] },
	withSlug: {
		url: "/users/:id",
		slugs: z.object({ id: z.string() }),
		returns: {} as { id: string },
	},
	withBoth: {
		url: "/users/:id/posts",
		slugs: z.object({ id: z.string() }),
		params: z.object({ page: z.number() }),
		returns: {} as { id: string }[],
	},
	create: {
		url: "/users/:id",
		slugs: z.object({ id: z.string() }),
		apiPayload: z.object({ name: z.string() }),
		returns: {} as { id: string },
	},
} satisfies ServerRoutes;

const client = createHttpClient({ serverUrl: "", routes });

export async function typeAssertions() {
	// ok: no params, no slugs → options omittable
	await client.GET("plain");
	await client.GET("plain", { auth: false });

	// ok: slugs required and inferred
	const [, user] = await client.GET("withSlug", { slugs: { id: "1" } });
	const _returns: { id: string } | null = user;

	// ok: both
	await client.GET("withBoth", { slugs: { id: "1" }, params: { page: 1 } });

	// ok: mutation slugs
	await client.POST("create", { name: "a" }, { slugs: { id: "1" } });
	await client.PATCH("create", { name: "a" }, { slugs: { id: "1" } });

	// @ts-expect-error - options required when the route declares slugs
	await client.GET("withSlug");

	// @ts-expect-error - slugs is required, not optional
	await client.GET("withSlug", { auth: false });

	// @ts-expect-error - wrong slug value type
	await client.GET("withSlug", { slugs: { id: 1 } });

	// @ts-expect-error - unknown slug key
	await client.GET("withSlug", { slugs: { id: "1", nope: "x" } });

	// @ts-expect-error - route declares no slugs
	await client.GET("plain", { slugs: { id: "1" } });

	// @ts-expect-error - route declares no params
	await client.GET("withSlug", { slugs: { id: "1" }, params: { page: 1 } });

	// @ts-expect-error - params required when declared
	await client.GET("withBoth", { slugs: { id: "1" } });

	// @ts-expect-error - slugs required on mutations too
	await client.POST("create", { name: "a" });
}
