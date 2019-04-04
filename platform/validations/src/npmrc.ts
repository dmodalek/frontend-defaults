import { ValidationResult, ValidationSeverityLevel } from '@namics/frontend-defaults-platform-core';
import { NPMRCAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';

export type NPMRCAnalyzerResult = {
	npmrc: boolean;
	npmrcSaveExactEnabled?: boolean;
};

export const npmrcAnalyzer = async (cwd: string, anayltics: NPMRCAnalyzerResult): Promise<ValidationResult[]> => {
	if (anayltics.npmrc) {
		if (!anayltics.npmrcSaveExactEnabled) {
			return [
				{
					level: ValidationSeverityLevel.error,
					message: `Field "save-exact=true" is required in the .npmrc file`,
					source: 'npmrcAnalyzer',
					url: 'https://docs.npmjs.com/misc/config#save-exact',
				},
			];
		}

		// .npmrc present, save-exact enabled = no issues!
		return [];
	} else {
		return [
			{
				level: ValidationSeverityLevel.error,
				message: `NPM configuration missing`,
				source: 'npmrcAnalyzer',
				url: 'https://docs.npmjs.com/misc/config#npmrc-files',
			},
		];
	}
};
