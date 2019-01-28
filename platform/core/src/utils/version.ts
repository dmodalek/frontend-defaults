import { getJSON } from './fs';
import { IPackage } from '../types/Package';
import { join } from 'path';
import latestVersion from 'latest-version';
import semver from 'semver';

export async function getInstalledDependencyVersion(dependency: string): Promise<string | undefined> {
	try {
		// TODO: should we use require.resolve instead of direct access
		const installedPackage = await getJSON<IPackage>(
			join(process.cwd(), 'node_modules', dependency, 'package.json')
		);
		return installedPackage.version;
	} catch (err) {
		return undefined;
	}
}

export async function checkDependencyUpdate(
	dependency: string
): Promise<{
	current?: string;
	latest?: string;
	upgradable: boolean;
}> {
	try {
		const installedVersion = await getInstalledDependencyVersion(dependency);
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