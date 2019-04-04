import { GitIgnoreAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel } from '@namics/frontend-defaults-platform-core';

export const gitIgnoreValidation = async (cwd: string, analytics: GitIgnoreAnalyzerResult): Promise<ValidationResult[]> => {
	if (analytics.gitignore) {
		// TODO: gitignore is available, so we need to validate the contents
		return [];
	}

	return [{
		level: ValidationSeverityLevel.error,
		message: 'Git ignore missing',
		source: 'gitIgnoreValidation'
	}];
}