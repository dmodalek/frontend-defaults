import {
	ValidationSeverityLevel,
	ValidationResult,
	validateInstallation,
} from '@namics/frontend-defaults-platform-core';
// import stylelintNamicsDefaults from '@namics/stylelint-config/index.js';
import { StylelintAnalyzerResult, RepositoryAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';

export const stylelintValidation = async (
	cwd: string,
	analytics: StylelintAnalyzerResult & RepositoryAnalyzerResult
): Promise<ValidationResult[]> => {
	if (!analytics.stylelint) {
		if (!!~['angular', 'react'].indexOf(analytics.projectType)) {
			// we are in react/angular context, no stylelint needed atm.
			return [];
		}

		return [
			{
				level: ValidationSeverityLevel.error,
				message: 'Stylelint is missing',
				source: 'stylelintValidation',
			},
		];
	}

	const validations: ValidationResult[] = [];

	if (!analytics.stylelintIgnore) {
		validations.push({
			level: ValidationSeverityLevel.warning,
			message: 'Missing .stylelintignore file',
			source: 'stylelintValidation',
		});
	}

	// TODO: Check the rules field of stylelint config

	validations.push(
		...validateInstallation({
			installation: analytics.stylelintInstallation,
			name: 'stylelint',
			source: 'stylelintValidation',
		})
	);

	return validations;
};
