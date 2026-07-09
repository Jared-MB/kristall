import type { RequestInterceptor } from "@kristall/http";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_NAME } from "@/modules/auth/utils/session";

export const authInterceptor: RequestInterceptor = async (
	request,
	_,
	options,
) => {
	/**
	 * WE NEED EXPLICITLY OPTION FALSE TO NOT SEND THE REQUEST AS AUTHENTICATED
	 */
	if (options.auth === false) {
		console.log(`[${request.method} ${request.url}] Skipping auth`);
		return request;
	}

	const cookieStore = await cookies();

	const session = cookieStore.get(SESSION_NAME)?.value;

	if (!session) {
		console.log("[AUTH INTERCEPTOR] No session found");
		redirect("/login");
	}

	request.headers.set("Authorization", `Bearer ${session}`);

	return request;
};
