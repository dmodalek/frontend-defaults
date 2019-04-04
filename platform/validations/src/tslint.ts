import { TSLintAnalyzerResult, TypeScriptAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import {
	ValidationResult,
	ValidationSeverityLevel,
	validateInstallation,
} from '@namics/frontend-defaults-platform-core';

export const tslintValidation = async (
	cwd: string,
	analytics: TypeScriptAnalyzerResult & TSLintAnalyzerResult
): Promise<ValidationResult[]> => {
	if (analytics.tslint) {
		let validationResults: ValidationResult[] = [];
		validationResults = validationResults.concat(
			validateInstallation({
				installation: analytics.tslintInstallation,
				name: 'ESLint',
				source: 'tslintValidation',
			})
		);

		return validationResults;
	}

	// only add issue when typescript is used
	return analytics.typescript
		? [
				{
					level: ValidationSeverityLevel.error,
					message: 'TSLint configuration missing',
					source: 'eslintValidation',
				},
		  ]
		: [];
};
