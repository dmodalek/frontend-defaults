import { getJSON } from './fs';
import { getPackageJSON } from './package';
import { IPackage } from '../types/Package';
import latestVersion from 'latest-version';
import { join } from 'path';
import semver from 'semver';

export type DependencyInstallation = {
	location: 'devDependencies' | 'dependencies' | null;
	declared: string | null,
	installed: string | null,
	latest: string | null
};

export async function getDependencyInstallation(cwd: string, dependency: string): Promise<DependencyInstallation> {
	const installed = await getInstalledDependencyVersion(cwd, dependency) || null;
	const pkg = await getPackageJSON(cwd);
	const declared = {
		dev: pkg.devDependencies![dependency],
		prod: pkg.dependencies![dependency]
	};
	const latest = await latestVersion(dependency);

	return {
		location: declared.dev ? 'devDependencies' : declared.prod ? 'dependencies' : null,
		declared: declared.dev || declared.prod || null,
		installed,
		latest,
	};
}

export async function getInstalledDependencyVersion(cwd: string = process.cwd(), dependency: string): Promise<string | undefined> {
	try {
		// TODO: should we use require.resolve instead of direct access
		const installedPackage = await getJSON<IPackage>(
			join(cwd, 'node_modules', dependency, 'package.json')
		);
		return installedPackage.version;
	} catch (err) {
		return undefined;
	}
}

export function dependencyIsOutdated(installedVersion: string, availableLatestVersion: string): boolean {
	return semver.lt(installedVersion, availableLatestVersion);
}

export async function checkDependencyUpdate(
	cwd: string = process.cwd(),
	dependency: string
): Promise<{
	current?: string;
	latest?: string;
	upgradable: boolean;
}> {
	try {
		const installedVersion = await getInstalledDependencyVersion(cwd, dependency);
		const availableLatestVersion = await latestVersion(dependency);

		if (installedVersion) {
			const hasNewVersion = semver.lt(installedVersion, availableLatestVersion);
			return {
				current: installedVersion,
				latest: availableLatestVersion,
				upgradable: hasNewVersion,
			};
		}

		return {
			upgradable: false,
		};
	} catch (err) {
		// don't require an update if a failure happens
		// within latestVersion or getting installed version
		return {
			upgradable: false,
		};
	}
}

export function versionSatisfaction(current: string, needToSatisfy: string) {
	return semver.satisfies(current, needToSatisfy);
}

export async function getLatestLTSVersion(dependency: string): Promise<string> {
	return await latestVersion(dependency, {
		version: 'lts'
	});
}

export async function checkNewerLTSVersion(
	dependency: string,
	currentVersion: string
): Promise<{
	current?: string;
	latest?: string;
	upgradable: boolean;
}> {
	const latest = await getLatestLTSVersion(dependency);

	return {
		current: currentVersion,
		latest,
		upgradable: semver.lt(currentVersion, latest)
	}
}