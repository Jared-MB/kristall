/**
 * Query keys for the auth module. Kept in their own module (instead of
 * `profile.ts`) so the 401 interceptor can import them without creating an
 * import cycle: http.ts → unauthorized.interceptor → profile.ts → http.ts.
 */
export const PROFILE_QUERY_KEY = ["profile"] as const;
