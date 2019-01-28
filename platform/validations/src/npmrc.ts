import { NPMRCAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { Validation, ValidationException, ValidationExceptionLevel } from '@namics/frontend-defaults-platform-core';

export class NPMRCValidation extends Validation<NPMRCAnalyzerResult> {
    async validate(): Promise<ValidationException[]> {
        const validationResults: ValidationException[] = [];

        if (!this.analyzer.analytics.npmrc) {
            // No .npmrc file found
            validationResults.push(
                new ValidationException({
                    message: `No .npmrc file found to reference to the correct node version`,
                    source: 'NPMRCValidation',
                    patches: [{ patch: 'NPMRCPatch' }],
                    level: ValidationExceptionLevel.error,
                })
            );
        }

        if (this.analyzer.analytics.npmrc && !this.analyzer.analytics.npmrcSaveExactEnabled) {
            // .npmrc file found but save-exact not enabled
            validationResults.push(
                new ValidationException({
                    message: `Save exact is not enabled in your .npmrc file`,
                    source: 'NPMRCValidation',
                    patches: [{ patch: 'NPMRCPatch' }],
                    level: ValidationExceptionLevel.warning,
                })
            );
        }

        return validationResults;
    }
}
