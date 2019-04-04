import { GitHooksAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import {
	ValidationResult,
	ValidationSeverityLevel,
	validateInstallation,
} from '@namics/frontend-defaults-platform-core';

export const gitHooksValidation = async (
	cwd: string,
	analytics: GitHooksAnalyzerResult
): Promise<ValidationResult[]> => {
	if (analytics.gitHooks) {
		let validationResults: ValidationResult[] = [];
		validationResults = validationResults.concat(
			validateInstallation({
				installation: analytics.gitHooksInstallation,
				name: 'GitHooks',
				source: 'gitHooksValidation',
			})
		);

		if (analytics.gitHooksLocation === 'rc') {
			validationResults.push({
				level: ValidationSeverityLevel.warning,
				message: 'For future projects we decided to use the package.json for configuration (.rc file used)',
				source: 'gitHooksValidation',
			});
		}

		return validationResults;
	}

	return [
		{
			level: ValidationSeverityLevel.info,
			message: 'GitHooks are missing',
			source: 'gitHooksValidation',
		},
	];
};
