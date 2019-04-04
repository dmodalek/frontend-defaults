import { TypeScriptAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel, validateInstallation } from '@namics/frontend-defaults-platform-core';

export const typescriptValidation = async (cwd: string, analytics: TypeScriptAnalyzerResult): Promise<ValidationResult[]> => {
	if (analytics.typescript) {
		return validateInstallation({
			installation: analytics.typescriptInstallation,
			name: 'TypeScript',
			source: 'typescriptValidation'
		});
	}

	return [];
}