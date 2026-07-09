import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { GET, POST } from "./http";
import { buildUrl } from "./utils/build-url";

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock localStorage globally
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	length: 0,
	key: vi.fn(),
};
global.localStorage = localStorageMock as unknown as Storage;

describe("http.ts primitives", () => {
	const requestInterceptors = [
		(request: any) => {
			request.headers.set("Authorization", "Bearer fake-token");
			return request;
		},
	];

	beforeEach(() => {
		fetchMock.mockReset();
		localStorageMock.getItem.mockReset();

		// Default successful response
		fetchMock.mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ success: true }),
			text: async () => JSON.stringify({ success: true }),
		});
	});

	describe("buildUrl", () => {
		it("should append parameters correctly", () => {
			const result = buildUrl("/api/test", { id: 1, name: "foo" });
			expect(result).toBe("/api/test?id=1&name=foo");
		});

		it("should handle missing or empty parameters", () => {
			expect(buildUrl("/api/test")).toBe("/api/test?");
			expect(buildUrl("/api/test", {})).toBe("/api/test?");
			expect(buildUrl("/api/test", undefined)).toBe("/api/test?");
		});

		it("should handle special characters in parameters", () => {
			const result = buildUrl("/api/search", { q: "hello world" });
			expect(result).toBe("/api/search?q=hello+world");
		});
	});

	describe("GET", () => {
		const defaultOptions = { serverUrl: "https://api.example.com" };

		it("should perform a basic GET request", async () => {
			await GET("/users", { ...defaultOptions, auth: false });
			expect(fetchMock).toHaveBeenCalledWith(
				"https://api.example.com/users",
				expect.objectContaining({ method: "GET" }),
			);
		});

		it("should pass auth options and throw if missing auth header on protected request", async () => {
			// auth is true by default. If we don't provide a token in headers via interceptors, it throws:
			await expect(GET("/protected", defaultOptions)).rejects.toThrow(
				"**GET** request on **/protected** was set as authenticated but no **Authorization** header was found",
			);

			// If we provide the interceptor that adds the token:
			await GET("/protected", {
				...defaultOptions,
				interceptors: { request: requestInterceptors },
			});
			expect(fetchMock.mock.calls[0][1].headers.get("Authorization")).toBe(
				"Bearer fake-token",
			);

			// If auth is false, it removes any existing token from the interceptor
			await GET("/public", {
				...defaultOptions,
				auth: false,
				interceptors: { request: requestInterceptors },
			});
			expect(
				fetchMock.mock.calls[1][1].headers.get("Authorization"),
			).toBeNull();
		});

		it("should throw an error if serverUrl is missing", async () => {
			await expect(GET("/users", {})).rejects.toThrow(
				"Server URL is not defined for **GET** request on **/users**",
			);
		});
	});

	describe("POST", () => {
		const defaultOptions = {
			serverUrl: "https://api.example.com",
			auth: false,
		};

		it("should perform a basic POST request with JSON body", async () => {
			await POST("/users", { name: "John" }, defaultOptions);
			expect(fetchMock).toHaveBeenCalledWith(
				"https://api.example.com/users",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify({ name: "John" }),
				}),
			);
		});

		it("should serialize to FormData correctly when bodyType is form-data", async () => {
			await POST(
				"/upload",
				{ file: "content", id: 1 },
				{ ...defaultOptions, bodyType: "form-data" },
			);
			const callArgs = fetchMock.mock.calls[0][1];
			expect(callArgs.body).toBeInstanceOf(FormData);
			expect(callArgs.body.get("file")).toBe("content");
			expect(callArgs.body.get("id")).toBe("1"); // object-to-formdata casts numbers to strings
		});

		it("should skip validation and return error if apiPayload validation fails", async () => {
			const schema = z.object({ age: z.number() });
			const [error, data] = await POST(
				"/age-restricted",
				// @ts-expect-error - testing runtime check
				{ age: "not_a_number" },
				{ ...defaultOptions, apiPayload: schema },
			);
			expect(error).toBeInstanceOf(z.ZodError);
			expect(data).toBeNull();
			expect(fetchMock).not.toHaveBeenCalled();
		});

		it("should send Zod-coerced body when apiPayload validation passes", async () => {
			const schema = z.object({ age: z.coerce.number() });
			await POST(
				"/age-restricted",
				// @ts-expect-error - sending string, coercion should convert it
				{ age: "42" },
				{ ...defaultOptions, apiPayload: schema },
			);
			const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);
			expect(sentBody).toEqual({ age: 42 }); // coerced string → number
		});

		it("should throw an error if serverUrl is missing", async () => {
			await expect(POST("/users", {}, { auth: false })).rejects.toThrow(
				"Server URL is not defined for **POST** request on **/users**",
			);
		});
	});

	describe("Error Handling (tryCatch wrapper)", () => {
		const defaultOptions = {
			serverUrl: "https://api.example.com",
			auth: false,
		};

		it("should handle network errors (e.g. fetch throws) and return [Error, null]", async () => {
			fetchMock.mockRejectedValueOnce(new Error("Network failure"));
			const [error, data] = await GET("/users", defaultOptions);
			expect(error).toBeInstanceOf(Error);
			expect(error?.message).toBe("Network failure");
			expect(data).toBeNull();
		});

		it("should handle JSON parsing errors gracefully and fallback to text error", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: false,
				status: 500,
				json: async () => {
					throw new Error("Invalid JSON");
				},
				text: async () => "Internal Server Error HTML page",
			});
			const [error, data] = await GET("/users", defaultOptions);
			expect(error).toBeInstanceOf(Error);
			expect(error?.message).toBe("Internal Server Error HTML page");
			expect(data).toBeNull();
		});
	});

	describe("Interceptors & Lifecycle", () => {
		const defaultOptions = {
			serverUrl: "https://api.example.com",
			auth: false,
		};

		it("should accurately pass modified request through multiple request interceptors", async () => {
			const [error] = await GET("/users", {
				...defaultOptions,
				interceptors: {
					request: [
						(req) => {
							req.headers.set("X-Step-1", "A");
							return req;
						},
						async (req) => {
							req.headers.set("X-Step-2", "B");
							return req;
						},
					],
				},
			});
			expect(error).toBeNull();
			const headers = fetchMock.mock.calls[0][1].headers;
			expect(headers.get("X-Step-1")).toBe("A");
			expect(headers.get("X-Step-2")).toBe("B");
		});

		describe("Characterization Tests", () => {
			it("should evaluate exceptions and extract body based on the intercepted response", async () => {
				const originalResponse = {
					ok: true,
					status: 200,
					statusText: "OK",
					url: "https://api.example.com/test",
					json: async () => ({ originalBody: true }),
					text: async () => JSON.stringify({ originalBody: true }),
				};

				fetchMock.mockResolvedValueOnce(originalResponse);

				const [error, result] = await GET("/test", {
					...defaultOptions,
					interceptors: {
						response: [
							(res) =>
								({
									...res,
									status: 404,
									statusText: "Not Found Modified",
								}) as Response,
						],
					},
				});

				expect(error).toBeInstanceOf(Error);
				expect(error?.message).toContain("Not Found Modified");
				expect(result).toBeNull();

				fetchMock.mockResolvedValueOnce(originalResponse);

				const [error2, result2] = await GET("/test", {
					...defaultOptions,
					interceptors: {
						response: [
							(res) =>
								({
									...res,
									status: 201,
									text: async () => JSON.stringify({ modifiedBody: true }),
								}) as Response,
						],
					},
				});

				expect(error2).toBeNull();
				expect(result2).toEqual({ modifiedBody: true });
			});
		});
	});
});
