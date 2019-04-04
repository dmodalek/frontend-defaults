import { ContributebuddyAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import {
	ValidationResult,
	ValidationSeverityLevel,
	validateInstallation,
} from '@namics/frontend-defaults-platform-core';

export const contributebuddyValidation = async (
	cwd: string,
	analytics: ContributebuddyAnalyzerResult
): Promise<ValidationResult[]> => {
	if (analytics.contributebuddy) {
		// contributebuddy is used in the project, validation below
		let validationResults: ValidationResult[] = [];
		validationResults = validationResults.concat(
			validateInstallation({
				installation: analytics.contributebuddyInstallation,
				name: 'Contributebuddy',
				source: 'contributebuddyValidation',
			})
		);

		if (!analytics.contributebuddyConfigFolder) {
			validationResults.push({
				level: ValidationSeverityLevel.error,
				message: 'No .contributebuddy folder found, make sure you set-up correctly',
				source: 'contributebuddyValidation',
			});
		}

		return validationResults;
	}

	return [
		{
			level: ValidationSeverityLevel.info,
			message: 'We recommend to use contribute-buddy to obtain maintainability',
			source: 'contributebuddyValidation',
		},
	];
};
