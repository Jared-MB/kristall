export const env = {
	SERVER_URL: (() => {
		const serverURL = process.env.SERVER_URL;
		if (!serverURL) {
			throw new Error("SERVER_URL is not defined");
		}
		return serverURL;
	})(),
	__IS__DEV__: process.env.NODE_ENV === "development",
} as const;
