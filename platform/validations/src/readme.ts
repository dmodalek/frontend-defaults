import { ReadmeAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel } from '@namics/frontend-defaults-platform-core';

export const readmeValidation = async (cwd: string, analytics: ReadmeAnalyzerResult): Promise<ValidationResult[]> => {
	if (analytics.readme) {
		// TODO: readme is available, so we need to validate the contents
		return [];
	}

	return [{
		level: ValidationSeverityLevel.error,
		message: 'You must create a readme file for your project',
		source: 'readmeValidation'
	}];
}