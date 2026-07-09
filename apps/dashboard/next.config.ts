import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	transpilePackages: ["@kristall/api", "@kristall/shared", "@kristall/http"],
	turbopack: {
		root: "C:/Users/amuno/Documents/proyectos/kristall-v3",
	},
	cacheComponents: true,
	typedRoutes: true,
	experimental: {
		turbopackFileSystemCacheForBuild: true,
		turbopackRustReactCompiler: true,
	},
};

export default nextConfig;
