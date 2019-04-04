import { EditorconfigAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel } from '@namics/frontend-defaults-platform-core';

export const editorconfigValidation = async (
	cwd: string,
	analytics: EditorconfigAnalyzerResult
): Promise<ValidationResult[]> => {
	if (analytics.editorConfig) {
		// TODO: editorconfig is available, so we need to validate all things
		return [];
	}

	return [
		{
			level: ValidationSeverityLevel.error,
			message: 'Default namics editorconfig file is required in every project',
			source: 'editorconfigValidation',
		},
	];
};
