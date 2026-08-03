import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { GET, PATCH, POST } from "./http";
import { createHttpClient } from "./http-client";
import type { ServerRoutes } from "./types";

vi.mock("./http", () => ({
	GET: vi.fn(),
	POST: vi.fn(),
	PATCH: vi.fn(),
}));

describe("createHttpClient", () => {
	const apiPayloadSchema = z.object({ name: z.string() });

	const routes = {
		getUsers: { url: "/users" },
		getUsersByRole: {
			url: "/users",
			params: z.object({ role: z.string() }),
		},
		getUserById: {
			url: "/users/:id",
			slugs: z.object({ id: z.string() }),
		},
		getUserPost: {
			url: "/users/:userId/posts/:postId",
			slugs: z.object({ userId: z.string(), postId: z.coerce.string() }),
			params: z.object({ draft: z.string() }),
		},
		createUser: {
			url: "/users",
			apiPayload: apiPayloadSchema,
		},
		updateUser: {
			url: "/users",
			apiPayload: apiPayloadSchema,
		},
		updateUserById: {
			url: "/users/:id",
			slugs: z.object({ id: z.string() }),
			apiPayload: apiPayloadSchema,
		},
	} satisfies ServerRoutes;

	const interceptors = { request: [vi.fn((r) => r)], response: [] };

	const config = {
		serverUrl: "https://api.example.com",
		routes,
		interceptors,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("GET", () => {
		it("should be callable without a second argument when route has no params", async () => {
			const client = createHttpClient(config);

			await client.GET("getUsers");

			expect(GET).toHaveBeenCalledTimes(1);
			expect(GET).toHaveBeenCalledWith("/users?", {
				serverUrl: config.serverUrl,
				interceptors: config.interceptors,
			});
		});

		it("should accept optional options when route has no params", async () => {
			const client = createHttpClient(config);
			const callOptions = { auth: false };

			await client.GET("getUsers", callOptions);

			expect(GET).toHaveBeenCalledWith("/users?", {
				...callOptions,
				serverUrl: config.serverUrl,
				interceptors: config.interceptors,
			});
		});

		it("should validate and serialize Zod params into the URL", async () => {
			const client = createHttpClient(config);

			await client.GET("getUsersByRole", { params: { role: "admin" } });

			expect(GET).toHaveBeenCalledWith(
				"/users?role=admin",
				expect.objectContaining({
					serverUrl: config.serverUrl,
				}),
			);
		});

		it("should throw when Zod params validation fails", async () => {
			const client = createHttpClient(config);

			await expect(
				// @ts-expect-error - intentionally passing wrong type to test runtime validation
				client.GET("getUsersByRole", { params: { role: 123 } }),
			).rejects.toThrow(z.ZodError);

			expect(GET).not.toHaveBeenCalled();
		});

		it("should forward config interceptors on every call", async () => {
			const client = createHttpClient(config);

			await client.GET("getUsers");

			expect(GET).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({ interceptors: config.interceptors }),
			);
		});

		it("should replace slug segments in the url", async () => {
			const client = createHttpClient(config);

			await client.GET("getUserById", { slugs: { id: "abc123" } });

			expect(GET).toHaveBeenCalledWith("/users/abc123?", expect.any(Object));
		});

		it("should replace every slug segment and keep params in the query string", async () => {
			const client = createHttpClient(config);

			await client.GET("getUserPost", {
				// @ts-expect-error - z.coerce.string() accepts a number as input
				slugs: { userId: "42", postId: 7 },
				params: { draft: "true" },
			});

			expect(GET).toHaveBeenCalledWith(
				"/users/42/posts/7?draft=true",
				expect.any(Object),
			);
		});

		it("should url-encode slug values", async () => {
			const client = createHttpClient(config);

			await client.GET("getUserById", { slugs: { id: "a b/c" } });

			expect(GET).toHaveBeenCalledWith("/users/a%20b%2Fc?", expect.any(Object));
		});

		it("should not forward params or slugs to the underlying call", async () => {
			const client = createHttpClient(config);

			await client.GET("getUserPost", {
				slugs: { userId: "42", postId: "7" },
				params: { draft: "true" },
			});

			expect(GET).toHaveBeenCalledWith(expect.any(String), {
				serverUrl: config.serverUrl,
				interceptors: config.interceptors,
			});
		});

		it("should throw when Zod slugs validation fails", async () => {
			const client = createHttpClient(config);

			await expect(
				// @ts-expect-error - intentionally passing wrong type to test runtime validation
				client.GET("getUserById", { slugs: { id: 123 } }),
			).rejects.toThrow(z.ZodError);

			expect(GET).not.toHaveBeenCalled();
		});

		it("should throw when a slug value is missing", async () => {
			const client = createHttpClient({
				...config,
				// no `slugs` schema, so nothing validates the missing value beforehand
				routes: { getUserById: { url: "/users/:id" } },
			});

			await expect(client.GET("getUserById")).rejects.toThrow(
				"Missing value for slug **:id** on **/users/:id**",
			);

			expect(GET).not.toHaveBeenCalled();
		});
	});

	describe("POST", () => {
		it("should forward the route apiPayload schema to the underlying POST call", async () => {
			const client = createHttpClient(config);

			await client.POST("createUser", { name: "John" });

			expect(POST).toHaveBeenCalledWith(
				"/users?",
				{ name: "John" },
				expect.objectContaining({
					apiPayload: apiPayloadSchema,
				}),
			);
		});

		it("should forward config interceptors", async () => {
			const client = createHttpClient(config);

			await client.POST("createUser", { name: "John" });

			expect(POST).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(Object),
				expect.objectContaining({
					interceptors: config.interceptors,
				}),
			);
		});

		it("should replace slug segments in the url", async () => {
			const client = createHttpClient(config);

			await client.POST(
				"updateUserById",
				{ name: "John" },
				{ slugs: { id: "abc123" } },
			);

			expect(POST).toHaveBeenCalledWith(
				"/users/abc123?",
				{ name: "John" },
				expect.any(Object),
			);
		});
	});

	describe("PATCH", () => {
		it("should call underlying PATCH with built url, body, and merged options", async () => {
			const client = createHttpClient(config);
			const body = { name: "Jane" };
			const callOptions = { auth: false };

			await client.PATCH("updateUser", body, callOptions);

			expect(PATCH).toHaveBeenCalledTimes(1);
			expect(PATCH).toHaveBeenCalledWith("/users?", body, {
				...callOptions,
				serverUrl: config.serverUrl,
				interceptors: config.interceptors,
				apiPayload: apiPayloadSchema,
			});
		});

		it("should replace slug segments in the url", async () => {
			const client = createHttpClient(config);

			await client.PATCH(
				"updateUserById",
				{ name: "Jane" },
				{ slugs: { id: "abc123" } },
			);

			expect(PATCH).toHaveBeenCalledWith(
				"/users/abc123?",
				{ name: "Jane" },
				expect.objectContaining({ apiPayload: apiPayloadSchema }),
			);
		});

		it("should forward the route apiPayload schema to the underlying PATCH call", async () => {
			const client = createHttpClient(config);

			await client.PATCH("updateUser", { name: "Jane" });

			expect(PATCH).toHaveBeenCalledWith(
				"/users?",
				{ name: "Jane" },
				expect.objectContaining({
					apiPayload: apiPayloadSchema,
				}),
			);
		});
	});
});
