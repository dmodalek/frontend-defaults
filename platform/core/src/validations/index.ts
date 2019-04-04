export { ValidationSeverityLevel, ValidationResult } from './definition';
export { validate } from './validate';

// preset helpers for general validation needed in nearly each validator
export { validateInstallation } from './presets/validate-installation';
export { validateConfigPresetJSON } from './presets/validate-config-preset';