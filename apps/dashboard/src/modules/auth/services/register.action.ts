"use server";

import { AUTH_ROUTES } from "@kristall/api/auth";
import { authClient } from "../http";
import { login } from "./login.action";

export async function register(formData: FormData) {
	const parsedData = AUTH_ROUTES.register.clientInput.safeParse({
		user: {
			email: formData.get("email"),
			name: formData.get("name"),
		},
		account: {
			password: formData.get("password"),
		},
		shop: {
			name: formData.get("shopName"),
		},
	});

	if (!parsedData.success) {
		return {
			error: parsedData.error.flatten().fieldErrors,
			success: false,
		};
	}

	const payload = parsedData.data;

	const [error, _response] = await authClient.POST(
		"register",
		{
			...payload,
			user: {
				...payload.user,
				role: "admin",
			},
		},
		{
			auth: false,
		},
	);

	if (error) {
		throw error;
	}

	const loginFormData = new FormData();

	loginFormData.append("email", payload.user.email);
	loginFormData.append("password", payload.account.password);

	try {
		await login(loginFormData);
	} catch (error) {
		return {
			error: {
				message: "No se pudo iniciar sesión después de registrarse",
				cause: error as Error,
			},
			success: false,
		};
	}
}
