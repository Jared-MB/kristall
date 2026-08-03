"use server";

import { AUTH_ROUTES } from "@kristall/api/auth";
import { redirect } from "next/navigation";
import { treeifyError } from "zod";
import { authClient } from "../http";
import { createSession } from "../utils/session";

export async function login(_prevState: unknown, formData: FormData) {
	const { email, password } = Object.fromEntries(formData.entries());

	const parsedData = AUTH_ROUTES.login.clientInput.safeParse({
		email,
		password,
	});

	if (!parsedData.success) {
		const errors = treeifyError(parsedData.error).properties;

		return {
			error: {
				fields: {
					email: {
						errors: errors?.email?.errors,
						value: email.toString(),
					},
					password: {
						errors: errors?.password?.errors,
						value: password.toString(),
					},
				},
			},
			success: false,
		};
	}

	const [error, response] = await authClient.POST(
		"login",
		{
			email: parsedData.data.email,
			password: parsedData.data.password,
		},
		{
			auth: false,
		},
	);

	if (error) {
		throw error;
	}

	if (response.status === "error") {
		const errorResponse = {
			success: false,
			error: {
				fields: {
					email: {
						errors: undefined as string[] | undefined,
						value: parsedData.data.email,
					},
					password: {
						errors: undefined as string[] | undefined,
						value: parsedData.data.password,
					},
				},
			},
		};

		if (response.statusCode === 401) {
			return {
				...errorResponse,
				error: {
					...errorResponse.error,
					fields: {
						...errorResponse.error.fields,
						email: {
							...errorResponse.error.fields.email,
							errors: ["Email o contraseña incorrectos"],
						},
						password: {
							...errorResponse.error.fields.password,
							errors: ["Email o contraseña incorrectos"],
						},
					},
				},
			} as typeof errorResponse;
		}

		return errorResponse;
	}

	const { data } = response;

	await createSession(data.access_token);

	// Resolve the shop on the next request (which carries the freshly set
	// session cookie). Reading it here would run through getShop's
	// `use cache: private` boundary, which only sees the incoming request's
	// cookies — not the one createSession just staged on the response.
	redirect("/");
}
