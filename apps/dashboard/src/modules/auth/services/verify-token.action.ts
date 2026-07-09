"use server";

import { redirect } from "next/navigation";
import { authClient } from "../http";

export async function verifyToken() {
	const [error, response] = await authClient.GET("verify-token");

	if (error) {
		throw error;
	}

	if (response.statusCode === 401) {
		redirect("/login");
	}
}
