import { NitroAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, validateInstallation } from '@namics/frontend-defaults-platform-core';

export const nitroValidation = async (cwd: string, analytics: NitroAnalyzerResult): Promise<ValidationResult[]> => {
	if (analytics.nitro) {
		let validationResults: ValidationResult[] = [];
		validationResults = validationResults.concat(
			validateInstallation({
				installation: analytics.nitroInstallation,
				name: 'Nitro',
				source: 'nitroValidation'
			})
		);

		// TODO: check nitro project update

		return validationResults;
	}

	// no nitro used, do nothing
	return [];
}