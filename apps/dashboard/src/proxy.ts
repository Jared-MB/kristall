import { type NextProxy, NextResponse, type ProxyConfig } from "next/server";
import { SESSION_NAME } from "./modules/auth/utils/session";

export const proxy: NextProxy = (request) => {
	const sessionCookie = request.cookies.get(SESSION_NAME)?.value;

	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
};

export const config: ProxyConfig = {
	matcher: ["/((?!login|register|_next/static|_next/image|.*\\.png$).*)"],
};
