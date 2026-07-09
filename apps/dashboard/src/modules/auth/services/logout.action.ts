"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { deleteSession } from "../utils/session";

export async function logout() {
	await deleteSession();

	// Immediately expire the previous user's cached shop/profile so a re-login
	// in the same browser tab can't see stale data.
	updateTag("user-shop");
	updateTag("user-profile");

	redirect("/login");
}
