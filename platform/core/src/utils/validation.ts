export const enum ValidationSeverityLevel {
    debug = 'DEBUG',
    info = 'INFO',
    warning = 'WARNING',
    error = 'ERROR',
}

/**
 * Format: [<PatchID>, <any Argument>]
 * or simple as string with only the PatchID
 */
type RequiredValidationPatch = [string, any];

export type ValidationResult = {
    message: string;
    level: ValidationSeverityLevel;
    source?: string;
    patch?: (string | RequiredValidationPatch)[],
}