// utility and core types
export { Constructable } from './types/Constructable';
export { IPackage } from './types/Package';
export { ValidationSeverityLevel, ValidationResult } from './utils/validation';

// filesystem utilities
export {
    getFileContents,
    getJSON,
    mergeJSON,
    fileExists,
    findFilesByPattern,
    displayPath,
} from './utils/fs';

// version utilities
export {
    DependencyInstallation,
    getDependencyInstallation,
    getInstalledDependencyVersion,
    checkDependencyUpdate,
    getLatestLTSVersion,
    checkNewerLTSVersion,
} from './utils/version';

// package utilities
export {
    getPackageJSON
} from './utils/package';

// templating utilities
export { template } from './utils/template';

// runtime functions
export { analyze } from './utils/analyze';

// TODO: clean those imports --> not needed anymore
export * from './Context';
export * from './ProjectAnalyzer';
export * from './ProjectValidator';
export * from './ProjectPatcher';

export * from './Analyzer';
export * from './Patch';
export * from './Validation';
