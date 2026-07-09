import { env } from "@/constants/env.server";

/**
 * @deprecated
 * @internal
 */
export const __sleep__ = async (seconds: number, tag: string) => {
	if (!env.__IS__DEV__) return;

	console.log(`Sleeping for ${seconds} seconds on ${tag}`);
	await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
