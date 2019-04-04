import { ValidationResult, ValidationSeverityLevel } from '../definition';
import eq from 'deep-equal';
type ValidateConfigPresetJSONOpts<T> = {
	name: string;
	config: T | undefined | null;
	defaults: Partial<T>;
	fields: string[];
};

export function validateConfigPresetJSON<T extends object>({
	name,
	config,
	defaults,
	fields,
}: ValidateConfigPresetJSONOpts<T>): ValidationResult[] {
	if (!config) {
		return [
			{
				level: ValidationSeverityLevel.error,
				source: 'validateConfigPresetJSON',
				message: `No prettier configuration found in your project`,
			},
		];
	}

	const configurationMissmatches = fields
		.map((field, pos) => {
			return {
				field,
				used: config[field],
				default: defaults[field],
				position: pos,
			};
		})
		.filter((comparison) => {
			// only filter settings which missmatch with the defaults
			if (Array.isArray(comparison.default) || typeof comparison.default === 'object') {
				return eq(comparison.default, comparison.used);
			}

			return comparison.default !== comparison.used;
		});

	return [
		{
			level: ValidationSeverityLevel.warning,
			source: 'validateConfigPresetJSON',
			message: `Detected configuration missmatch for fields in ${name}: ${configurationMissmatches.join(', ')}`,
		},
	];
}
