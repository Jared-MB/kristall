import "server-only";
import { ONE_DAY_SESSION_EXPIRATION_TIME_IN_MS } from "@kristall/shared";
import { cookies } from "next/headers";

export const SESSION_NAME = "session";

export async function createSession(token: string) {
	const expiresAt = new Date(
		Date.now() + ONE_DAY_SESSION_EXPIRATION_TIME_IN_MS,
	);
	const cookieStore = await cookies();

	cookieStore.set(SESSION_NAME, token, {
		httpOnly: true,
		secure: true,
		expires: expiresAt,
		sameSite: "lax",
		path: "/",
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(SESSION_NAME);
}
