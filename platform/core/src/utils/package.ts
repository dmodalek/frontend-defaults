import { getJSON } from './fs';
import { IPackage } from '../types/Package';
import { join } from 'path';

const cache = new Map<string, IPackage>();

export const getPackageJSON = async (cwd: string): Promise<IPackage> => {
	const fromCache = cache.get(cwd);
	if (!!fromCache) {
		// use cached package if available
		return Promise.resolve(fromCache);
	}

	let pkg = await getJSON<IPackage>(join(cwd, 'package.json'));

	// add fields if they do not exist
	pkg = {
		...pkg,
		dependencies: pkg.dependencies || {},
		devDependencies: pkg.devDependencies || {},
		peerDependencies: pkg.peerDependencies || {},
	};

	cache[cwd] = pkg;
	return pkg;
};
