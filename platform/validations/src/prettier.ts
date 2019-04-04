import {
	ValidationResult,
	ValidationSeverityLevel,
	validateConfigPresetJSON,
} from '@namics/frontend-defaults-platform-core';
import { PrettierAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import prettierNamicsDefaults from '@namics/prettier-config/index.js';

export const prettierValidation = async (
	cwd: string,
	anayltics: PrettierAnalyzerResult
): Promise<ValidationResult[]> => {
	const validations: ValidationResult[] = [];

	if (!anayltics.prettier) {
		return [
			{
				level: ValidationSeverityLevel.error,
				message: 'Prettier is missing',
				url: 'https://prettier.io',
				source: 'prettierValidation',
			},
		];
	}

	if (anayltics.prettierConfigLocation === 'package') {
		validations.push({
			level: ValidationSeverityLevel.warning,
			message: 'Prettier configuration should be in its own .prettierrc.js file',
			url: 'https://prettier.io/docs/en/configuration.html',
			source: 'prettierValidation',
		});
	}

	// validate user config against the defaults
	validations.push(
		...validateConfigPresetJSON({
			name: 'prettier',
			config: anayltics.prettierSettings,
			defaults: prettierNamicsDefaults,
			fields: [
				'printWidth',
				'tabWidth',
				'useTabs',
				'semi',
				'singleQuote',
				'trailingComma',
				'bracketSpacing',
				'jsxBracketSameLine',
				'arrowParens',
			],
		})
	);

	return validations;
};
