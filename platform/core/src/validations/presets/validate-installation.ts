import { ValidationResult, ValidationSeverityLevel } from '../definition';
import { DependencyInstallation, checkDependencyUpdate } from '../../utils/version';

type ValidateInstallationOpts = {
	installation?: DependencyInstallation,
	source: string,
	name: string
}

export function validateInstallation(opts: ValidateInstallationOpts): ValidationResult[] {
	const validationInstallationResults: ValidationResult[] = [];

	if (!opts.installation) {
		validationInstallationResults.push({
			level: ValidationSeverityLevel.error,
			message: `Dependency ${opts.name} has a reference, but is not installed`,
			source: opts.source
		});
	} else if (opts.installation.installed) {
		if (checkDependencyUpdate(opts.installation.installed, opts.installation.latest!)) {
			validationInstallationResults.push({
				level: ValidationSeverityLevel.info,
				message: `Dependency ${opts.name} is outdated, try update to ${opts.installation.latest}`,
				source: opts.source
			});
		}
	}

	return validationInstallationResults;
}