import { IPackage } from './types/Package';

export class PackageAnalyzer {
	constructor(private pkg: IPackage | null) {}

	public get dependecies() {
		return this.pkg ? this.pkg.dependencies || {} : {};
	}

	public get devDependencies() {
		return this.pkg ? this.pkg.devDependencies || {} : {};
	}

	public anyDependencyExists(
		name: string
	): { location: 'dependencies' | 'devDependencies'; version: string } | false {
		const dep = this.dependencyExists(name);
		if (dep) {
			return {
				location: 'dependencies',
				version: dep,
			};
		}

		const devDep = this.devDependencyExists(name);
		if (devDep) {
			return {
				location: 'devDependencies',
				version: devDep,
			};
		}

		return false;
	}

	/**
	 * Returns the version or false if not found
	 * @param name the dependency name
	 */
	public dependencyExists(name: string): string | false {
		if (!this.pkg) {
			return false;
		}

		return this.dependecies[name] || false;
	}

	/**
	 * Returns the version or false if not found
	 * @param name the dev-dependency name
	 */
	public devDependencyExists(name: string): string | false {
		if (!this.pkg) {
			return false;
		}

		return this.devDependencies[name] || false;
	}

	/**
	 * Returns the version or false if not found
	 * @param name the peer-dependency name
	 */
	public peerDependencyExists(name: string): string | false {
		if (!this.pkg) {
			return false;
		}

		return (this.pkg.peerDependencies || {})[name] || false;
	}
}
