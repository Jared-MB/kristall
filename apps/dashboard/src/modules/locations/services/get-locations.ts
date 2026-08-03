import { cacheLife, cacheTag } from "next/cache";
import { LOCATION_TAGS } from "../constants/tags";
import { locationsClient } from "../http";

/**
 * Read-only and server-only: the page awaits it directly, so it deliberately
 * skips `"use server"`, which would publish it as a POST endpoint nothing
 * calls.
 *
 * `"use cache: private"` keeps the result in the browser's memory only — it is
 * never stored on the server and does not survive a reload — which is what
 * makes it safe for per-user data. `hours` is a ceiling, not the refresh
 * mechanism: every mutation expires `LOCATION_TAGS.ALL`, so the profile only
 * bounds how long a change made elsewhere (another tab, another device, the
 * API) can stay invisible.
 */
export async function getLocations() {
	"use cache: private";
	cacheTag(LOCATION_TAGS.ALL);
	cacheLife("hours");

	const [error, response] = await locationsClient.GET("get-locations");

	if (error) {
		throw error;
	}

	if (response.status !== "ok") {
		throw new Error(response.message);
	}

	return response.data;
}
