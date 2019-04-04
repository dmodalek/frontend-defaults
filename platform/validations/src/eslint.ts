import { ESLintAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel, validateInstallation } from '@namics/frontend-defaults-platform-core';

/**
 * TODO: Should we check if a project is a TS project in advance? So we wouldn't need to run this validation atm.
 * I think we'll need to update this as soon as TSLint will be integrated into ESLint
 */
export const eslintValidation = async (cwd: string, analytics: ESLintAnalyzerResult): Promise<ValidationResult[]> => {
	if (analytics.eslint) {
		// TODO: eslint is available, so we need to validate all things
		let validationResults: ValidationResult[] = [];
		validationResults = validationResults.concat(
			validateInstallation({
				installation: analytics.eslintInstallation,
				name: 'ESLint',
				source: 'eslintValidation'
			})
		);

		if (!analytics.eslintIgnore) {
			validationResults.push({
				level: ValidationSeverityLevel.warning,
				message: 'No .eslintignore found',
				source: 'eslintValidation'
			})
		}

		return validationResults;
	}

	return [{
		level: ValidationSeverityLevel.warning,
		message: 'ESLint configuration missing',
		source: 'eslintValidation'
	}];
}