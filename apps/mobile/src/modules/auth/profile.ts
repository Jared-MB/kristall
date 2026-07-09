import { queryOptions, useQuery } from "@tanstack/react-query";
import { authClient } from "./http";
import { PROFILE_QUERY_KEY } from "./keys";
import { getSessionToken } from "./token-store";

/**
 * Session source of truth, shared by the root guard and any screen that needs
 * the profile. Resolves to `null` when there is no stored token, so "logged
 * out" is a normal state instead of an error — errors are reserved for real
 * network/server failures.
 */
export const profileQueryOptions = queryOptions({
	queryKey: PROFILE_QUERY_KEY,
	queryFn: async () => {
		const token = await getSessionToken();

		if (!token) {
			return null;
		}

		const [error, response] = await authClient.GET("profile");

		if (error) {
			throw error;
		}

		if (response.status !== "ok") {
			throw new Error(response.message);
		}

		return response.data;
	},
	retry: false,
});

export function useProfile() {
	return useQuery(profileQueryOptions);
}
