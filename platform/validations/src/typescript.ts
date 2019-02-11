import { TypeScriptAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import {
	checkDependencyUpdate,
	ValidationResult,
	ValidationSeverityLevel,
} from '@namics/frontend-defaults-platform-core';

export const typescriptValidation = async (cwd: string, analytics: TypeScriptAnalyzerResult): Promise<ValidationResult[]> => {
	if (!analytics.typescript) {
		// no typescript found, skip validation
		return [];
	}

	const validations: ValidationResult[] = [];

	if (analytics.typescriptInstallation && !analytics.typescriptInstallation.installed) {
		// TypeScript is not installed, which is not allowed
		validations.push({
			message: `Using TypeScript without explicit installtion is not allowed`,
			source: 'TypeScriptValidation',
			level: ValidationSeverityLevel.error,
			patch: ['TypeScriptInstallationPatch'],
		});
	} else {
		const update = await checkDependencyUpdate(cwd, 'typescript');
		if (update.upgradable) {
			// TypeScript is outdated, upgrade would be an option
			validations.push({
				message: `Please update TypeScript to v${update.latest} (installed: v${update.current})`,
				source: 'TypeScriptValidation',
				level: ValidationSeverityLevel.info,
				patch: [
					['TypeScriptUpdatePatch', {
						current: update.current,
						latest: update.latest
					}]
				],
			});
		}
	}

	return validations;
}