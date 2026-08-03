"use client";

import {
	environmentManager,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				// With the default of 0 every mount refetches on the spot, which
				// throws away whatever the server already rendered.
				staleTime: 60 * 1000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

/**
 * A module-level client would be shared across requests on the server, and the
 * cache is keyed by query key alone — one user's data would be handed to the
 * next. Only the browser, where there is a single user, keeps a singleton.
 */
function getQueryClient() {
	if (environmentManager.isServer()) {
		return makeQueryClient();
	}

	browserQueryClient ??= makeQueryClient();

	return browserQueryClient;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
