import type { RequestInterceptor } from "@kristall/http";
import { getSessionToken } from "@/modules/auth/token-store";

/**
 * Attaches the stored session token as a Bearer header.
 *
 * Mirrors the dashboard auth interceptor, but reads the token from the mobile
 * secure token store instead of request cookies. Pass `{ auth: false }` on a
 * request to skip it (e.g. login).
 */
export const authInterceptor: RequestInterceptor = async (
	request,
	_,
	options,
) => {
	if (options.auth === false) {
		return request;
	}

	const token = await getSessionToken();

	if (token) {
		request.headers.set("Authorization", `Bearer ${token}`);
	}

	return request;
};
