import type { ServerRoutes } from "@kristall/http";
import type { ApiResponse } from "@kristall/shared";
import { z } from "zod";

const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
});

const RegisterSchema = z.object({
	user: z.object({
		email: z.email(),
		name: z.string(),
	}),
	account: z.object({
		password: z.string().min(6),
	}),
	shop: z.object({
		name: z.string(),
	}),
});

export const AUTH_ROUTES = {
	login: {
		url: "/auth/login",
		clientInput: LoginSchema,
		apiPayload: LoginSchema,
		returns: {} as ApiResponse<{ access_token: string }>,
	},
	profile: {
		url: "/auth/profile",
		returns: {} as ApiResponse<{
			_id: string;
			name: string;
			role: string;
			email: string;
		}>,
	},
	"verify-token": {
		url: "/auth/verify-token",
		returns: {} as ApiResponse<{
			userId: string;
			name: string;
		}>,
	},
	register: {
		url: "/auth/register",
		clientInput: RegisterSchema,
		apiPayload: RegisterSchema.extend({
			user: RegisterSchema.shape.user.extend({
				role: z.enum(["admin", "user"]),
			}),
		}),
		returns: {} as ApiResponse<any>,
	},
} satisfies ServerRoutes;
