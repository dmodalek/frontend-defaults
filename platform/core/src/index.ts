// utility and core types
export { Constructable } from './types/Constructable';
export { IPackage } from './types/Package';

// validation stuff
export {
	ValidationSeverityLevel,
	ValidationResult,
	validate,
	validateInstallation,
	validateConfigPresetJSON,
} from './validations';

// action stuff for patches
export { runActions } from './actions';

// filesystem utilities
export {
	getFileContents,
	getJSON,
	getStats,
	mergeJSON,
	fileExists,
	directoryExists,
	findFilesByPattern,
	displayPath,
} from './utils/fs';

// version utilities
export {
	DependencyInstallation,
	getDependencyInstallation,
	getInstalledDependencyVersion,
	checkDependencyUpdate,
	dependencyIsOutdated,
	getLatestLTSVersion,
	checkNewerLTSVersion,
} from './utils/version';

// package utilities
export { getPackageJSON } from './utils/package';

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
