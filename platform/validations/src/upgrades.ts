import { join } from 'path';
import {
	Validation,
	ValidationException,
	getJSON,
	IPackage,
	ValidationExceptionLevel,
} from '@namics/frontend-defaults-platform-core';

type SinglePackageUpgradeValidation = {
	location: 'dependencies' | 'devDependencies';
	package: string;
	name: string;
	installed: string;
	latest: string;
	hasUpdate: boolean;
};

export class UpgradesValidation extends Validation<void> {
	async validate(): Promise<ValidationException[]> {
		// return [...dependencyUpgrades, ...devDependencyUpgrades]
		// 	.map(
		// 		(result): ValidationException | null => {
		// 			if (result.hasUpdate) {
		// 				return new ValidationException({
		// 					message: `${result.name} should be upgraded from ${result.installed} to ${result.latest}`,
		// 					source: `UpgradesValidation#${result.location}`,
		// 					level: ValidationExceptionLevel.info,
		// 				});
		// 			}

		// 			return null;
		// 		}
		// 	)
		// 	.filter(Boolean) as ValidationException[];
		return [];
	}
}
