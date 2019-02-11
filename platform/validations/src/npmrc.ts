import { NPMRCAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel } from '@namics/frontend-defaults-platform-core';

export const npmrcValidation = async (cwd: string, analytics: NPMRCAnalyzerResult): Promise<ValidationResult[]> => {
    const validationResults: ValidationResult[] = [];

    if (!analytics.npmrc) {
        // No .npmrc file found
        validationResults.push({
            message: `No .npmrc file found to reference to the correct node version`,
            source: 'NPMRCValidation',
            patch: [['NPMRCPatch', { create: true }]],
            level: ValidationSeverityLevel.error,
        });
    }

    if (analytics.npmrc && !analytics.npmrcSaveExactEnabled) {
        // .npmrc file found but save-exact not enabled
        validationResults.push({
            message: `Save exact is not enabled in your .npmrc file`,
            source: 'NPMRCValidation',
            patch: ['NPMRCPatch'],
            level: ValidationSeverityLevel.warning,
        });
    }

    return validationResults;
}