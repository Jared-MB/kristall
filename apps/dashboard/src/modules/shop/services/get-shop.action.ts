"use server";

import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";
import { shopClient } from "../http";

export async function getShop() {
	"use cache: private";
	cacheTag("user-shop");
	cacheLife("weeks");

	const [error, response] = await shopClient.GET("get-shop");

	if (error) {
		throw error;
	}

	if (response.status !== "ok") {
		if (response.statusCode === 401) {
			redirect("/login");
		}

		throw new Error("Something went wrong");
	}

	return response.data;
}
