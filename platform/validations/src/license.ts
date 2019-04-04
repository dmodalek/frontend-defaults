import { LicenseAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel } from '@namics/frontend-defaults-platform-core';

export const licenseValidation = async (cwd: string, analytics: LicenseAnalyzerResult): Promise<ValidationResult[]> => {
	if (analytics.license) {
		// TODO: license is available, so we need to validate the content
		return [];
	}

	return [{
		level: ValidationSeverityLevel.warning,
		message: 'You don\'t have a license file in your project',
		source: 'licenseValidation'
	}];
}