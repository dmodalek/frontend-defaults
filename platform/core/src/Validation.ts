import { IProjectAnalyzer } from './ProjectAnalyzer';

export const enum ValidationExceptionLevel {
	debug = 'DEBUG',
	info = 'INFO',
	warning = 'WARNING',
	error = 'ERROR',
}

type ValidationExceptionOptions = {
	message: string;
	source: string;
	patches?: RequiredValidationPatch[];
	level: ValidationExceptionLevel;
};

export type RequiredValidationPatch = {
	patch: string;
	arguments?: any;
};

/**
 * Validation exception implementation, used for any kind of validation
 * @class
 * @extends {Error}
 * @author Jan Biasi <jan.biasi@namics.com>
 */
export class ValidationException extends Error {
	public patches: RequiredValidationPatch[] | undefined;
	public source: string = 'unknown';
	public level: ValidationExceptionLevel = ValidationExceptionLevel.debug;

	constructor({ message, source, level, patches }: ValidationExceptionOptions) {
		super(message);

		this.source = source;
		this.level = level;
		this.patches = patches;

		Object.setPrototypeOf(this, new.target.prototype);
	}

	toString() {
		return `Validate ${this.source}: ${this.message} [${this.level}]`;
	}
}

export interface IValidation {
	validate(): Promise<ValidationException[]>;
}

type ValidationConstructionOpts<T> = {
	analyzer: IProjectAnalyzer<T>;
};

/**
 * Main abstract validation providing a facade for validation implementations
 * @class
 * @abstract
 * @implements {IValidation}
 * @requires IProjectAnalyzer<T>
 * @author Jan Biasi <jan.biasi@namics.com>
 */
export abstract class Validation<T> implements IValidation {
	/**
	 * Analyzer used by the validation itself
	 * @type {IProjectAnalyzer<T>}
	 */
	protected analyzer: IProjectAnalyzer<T>;

	/**
	 * Creates a new validation
	 * @constructor
	 * @param {ValidationConstructionOpts<T>} options
	 */
	constructor({ analyzer }: ValidationConstructionOpts<T>) {
		this.analyzer = analyzer;
	}

	/**
	 * Main validation method, add your validation stuff here
	 * @async
	 * @abstract
	 * @returns {Promise<ValidationException[]>}
	 */
	public abstract async validate(): Promise<ValidationException[]>;
}
