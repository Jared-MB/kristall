import { QueryClient } from "@tanstack/react-query";

/**
 * Shared QueryClient instance. Lives outside the React tree so non-component
 * code (e.g. the 401 response interceptor) can reset the session query.
 */
export const queryClient = new QueryClient();
