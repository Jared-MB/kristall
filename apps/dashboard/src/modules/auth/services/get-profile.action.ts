"use server";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { authClient } from "../http";

export async function getProfile() {
	"use cache: private";
	cacheLife("weeks");
	cacheTag("user-profile");

	const [error, response] = await authClient.GET("profile");
	if (error) {
		throw error;
	}

	if (response.status !== "ok") {
		redirect("/login");
	}

	return response.data;
}
