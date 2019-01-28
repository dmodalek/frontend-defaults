import { TypeScriptAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import {
	Validation,
	ValidationException,
	checkDependencyUpdate,
	ValidationExceptionLevel,
} from '@namics/frontend-defaults-platform-core';

export class TypeScriptValidation extends Validation<TypeScriptAnalyzerResult> {
	async validate(): Promise<ValidationException[]> {
		if (!this.analyzer.analytics.typescript) {
			// no typescript found, skip validation
			return [];
		}

		const validations: ValidationException[] = [];

		if (!this.analyzer.analytics.typescriptInstallation) {
			// TypeScript is not installed, which is not allowed
			validations.push(
				new ValidationException({
					message: `Using TypeScript without explicit installtion is not allowed`,
					source: 'TypeScriptValidation',
					level: ValidationExceptionLevel.error,
					patches: [{
						patch: 'TypeScriptInstallationPatch'
					}],
				})
			);
		} else {
			const update = await checkDependencyUpdate('typescript');
			if (update.upgradable) {
				// TypeScript is outdated, upgrade would be an option
				validations.push(
					new ValidationException({
						message: `Please update TypeScript to v${update.latest} (installed: v${update.current})`,
						source: 'TypeScriptValidation',
						level: ValidationExceptionLevel.info,
						patches: [{
							patch: 'TypeScriptUpdatePatch',
							arguments: {
								current: update.current,
								latest: update.latest
							}
						}],
					})
				);
			}
		}

		return validations;
	}
}
