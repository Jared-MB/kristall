/// <reference types="node" />

const fs = require('node:fs/promises');
const path = require('node:path');
const chokidar = require('chokidar');

const modulesRoute = path.resolve(__dirname, '../../apps/server/src/modules');
const typesRoute = path.resolve(__dirname, '../shared/src');

const watcher = chokidar.watch(modulesRoute, {
	ignoreInitial: true,
	depth: 0,
	awaitWriteFinish: true,
});

watcher.on("addDir", async (dirPath) => {
	const absoluteRoute = path.resolve(dirPath);

	if (path.dirname(absoluteRoute) !== modulesRoute) return;

	await writeModuleNames();
});

watcher.on('unlinkDir', async (dirPath) => {
	const absoluteRoute = path.resolve(dirPath);

	if (path.dirname(absoluteRoute) !== modulesRoute) return;

	await writeModuleNames();
});

async function writeModuleNames() {
	const dirs = await fs.readdir(modulesRoute);
	const names = dirs.map(dir => `"${dir}"`);

	await fs.writeFile(path.join(typesRoute, 'modules.ts'),
		`// GENERATED FILE - do not edit.
// Written by packages/nestjs-modules-detector from apps/server/src/modules.
export type Modules = ${names.join(' | ')};

export const MODULES_ARRAY = [${names.join(', ')}] as const;
`
	)

	console.log("Module names written correctly")
}

writeModuleNames()

console.log('Watching for new modules in:', modulesRoute);