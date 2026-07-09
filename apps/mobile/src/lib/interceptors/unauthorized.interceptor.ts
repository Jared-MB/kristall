import type { ResponseInterceptor } from "@kristall/http";
import { queryClient } from "@/lib/query-client";
import { PROFILE_QUERY_KEY } from "@/modules/auth/keys";
import { clearSessionToken } from "@/modules/auth/token-store";

/**
 * Ends the local session when the server rejects the token (expired/revoked).
 * Resetting the profile query flips the root layout's Stack.Protected guard,
 * which redirects to login on its own.
 *
 * Only reacts to requests that carried an Authorization header: a 401 from
 * login with wrong credentials must not touch the session.
 */
export const unauthorizedInterceptor: ResponseInterceptor = async (
	response,
	context,
) => {
	if (response.status === 401 && context.headers.has("Authorization")) {
		await clearSessionToken();
		// Not awaited: resetQueries refetches ["profile"] (which now resolves
		// to null) and waiting here would stall the request that got the 401.
		void queryClient.resetQueries({ queryKey: PROFILE_QUERY_KEY });
	}

	return response;
};
