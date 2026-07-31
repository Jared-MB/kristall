import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	transpilePackages: ["@kristall/api", "@kristall/shared", "@kristall/http"],
	turbopack: {
		root: path.resolve(__dirname, "../.."),
	},
	cacheComponents: true,
	typedRoutes: true,
	experimental: {
		turbopackFileSystemCacheForBuild: true,
		turbopackRustReactCompiler: true,
	},
};

export default nextConfig;
