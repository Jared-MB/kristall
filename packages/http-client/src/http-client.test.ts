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
        createUser: {
            url: "/users",
            apiPayload: apiPayloadSchema,
        },
        updateUser: {
            url: "/users",
            apiPayload: apiPayloadSchema,
        },
    } satisfies ServerRoutes;

    const interceptors = { request: [vi.fn((r) => r)], response: [] };

    const config = {
        serverUrl: "https://api.example.com",
        routes,
        adapter: vi.fn(),
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
                adapter: config.adapter,
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
                adapter: config.adapter,
                interceptors: config.interceptors,
            });
        });

        it("should validate and serialize Zod params into the URL", async () => {
            const client = createHttpClient(config);

            await client.GET("getUsersByRole", { params: { role: "admin" } });

            expect(GET).toHaveBeenCalledWith("/users?role=admin", expect.objectContaining({
                serverUrl: config.serverUrl,
            }));
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

        it("should forward config adapter on every call", async () => {
            const client = createHttpClient(config);

            await client.GET("getUsers");

            expect(GET).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ adapter: config.adapter }),
            );
        });
    });

    describe("POST", () => {
        it("should forward the route apiPayload schema to the underlying POST call", async () => {
            const client = createHttpClient(config);

            await client.POST("createUser", { name: "John" });

            expect(POST).toHaveBeenCalledWith("/users?", { name: "John" }, expect.objectContaining({
                apiPayload: apiPayloadSchema,
            }));
        });

        it("should forward config interceptors and adapter", async () => {
            const client = createHttpClient(config);

            await client.POST("createUser", { name: "John" });

            expect(POST).toHaveBeenCalledWith(
                expect.any(String),
                expect.any(Object),
                expect.objectContaining({
                    interceptors: config.interceptors,
                    adapter: config.adapter,
                }),
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
                adapter: config.adapter,
                interceptors: config.interceptors,
                apiPayload: apiPayloadSchema,
            });
        });

        it("should forward the route apiPayload schema to the underlying PATCH call", async () => {
            const client = createHttpClient(config);

            await client.PATCH("updateUser", { name: "Jane" });

            expect(PATCH).toHaveBeenCalledWith("/users?", { name: "Jane" }, expect.objectContaining({
                apiPayload: apiPayloadSchema,
            }));
        });
    });
});
