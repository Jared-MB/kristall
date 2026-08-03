/**
 * Cache tags for the location reads. Next owns the cache for this module, so
 * these are the only keys involved — there is no parallel client-side cache to
 * keep in sync.
 */
export const LOCATION_TAGS = {
	ALL: "locations",
} as const;
