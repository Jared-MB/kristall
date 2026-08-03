/**
 * Replaces every `:slug` segment of a path with its matching value.
 *
 * Keys are matched without the leading colon (`/locations/:id` → `{ id }`),
 * and values are URL-encoded. Throws when a segment has no value so a request
 * is never sent to a literal `:id` path.
 */
export const resolveSlugs = (
	url: `/${string}`,
	slugs?: Record<string, string | number>,
) => {
	if (!url.includes(":")) return url;

	return url
		.split("/")
		.map((segment) => {
			if (!segment.startsWith(":")) return segment;

			const key = segment.slice(1);
			const value = slugs?.[key];

			if (value === undefined || value === "") {
				throw new Error(
					`Missing value for slug **:${key}** on **${url}**. Pass it as \`slugs: { ${key}: ... }\``,
				);
			}

			return encodeURIComponent(value);
		})
		.join("/") as `/${string}`;
};

export const buildUrl = (
	url: `/${string}`,
	params?: Record<string, any>,
	slugs?: Record<string, string | number>,
) =>
	`${resolveSlugs(url, slugs)}?${new URLSearchParams(params).toString()}` as const;
