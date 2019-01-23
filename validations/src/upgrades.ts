import { join } from 'path';
import semver from 'semver';
import latestVersion from 'latest-version';
import {
	Validation,
	ValidationException,
	getJSON,
	IPackage,
	ValidationExceptionLevel,
} from '@namics/frontend-defaults-core';

type SinglePackageUpgradeValidation = {
	location: 'dependencies' | 'devDependencies';
	package: string;
	name: string;
	installed: string;
	latest: string;
	hasUpdate: boolean;
};

export type UpgradesValidationResult = {};

class UpgradesValidation extends Validation<UpgradesValidationResult> {
	async validate(): Promise<ValidationException[]> {
		const dependencyUpgrades = await this.getUpdatesFor('dependencies', this.analyzer.packageAnalyzer.dependecies);
		const devDependencyUpgrades = await this.getUpdatesFor(
			'devDependencies',
			this.analyzer.packageAnalyzer.devDependencies
		);

		return [...dependencyUpgrades, ...devDependencyUpgrades]
			.map(
				(result): ValidationException | null => {
					if (result.hasUpdate) {
						return new ValidationException({
							message: `${result.name} should be upgraded from ${result.installed} to ${result.latest}`,
							source: `UpgradesValidation#${result.location}`,
							level: ValidationExceptionLevel.info,
						});
					}

					return null;
				}
			)
			.filter(Boolean) as ValidationException[];
	}

	async getUpdatesFor(
		location: 'dependencies' | 'devDependencies',
		anyDependencies: { [name: string]: string }
	): Promise<SinglePackageUpgradeValidation[]> {
		return Promise.all(
			Object.keys(anyDependencies).map(
				async (dependency): Promise<SinglePackageUpgradeValidation> => {
					const installed = await getJSON<IPackage>(join(require.resolve(dependency), 'package.json'));
					const latest = await latestVersion(dependency);

					return {
						location,
						name: dependency,
						package: anyDependencies[dependency],
						installed: installed.version!,
						latest,
						hasUpdate: semver.lt(installed.version, latest),
					};
				}
			)
		);
	}
}
