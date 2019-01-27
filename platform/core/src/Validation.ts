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
	patch?: string;
	level: ValidationExceptionLevel;
};

export class ValidationException extends Error {
	public patch: string | undefined;
	public source: string = 'unknown';
	public level: ValidationExceptionLevel = ValidationExceptionLevel.debug;

	constructor({ message, source, level, patch }: ValidationExceptionOptions) {
		super(message);

		this.source = source;
		this.level = level;
		this.patch = patch;

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

export abstract class Validation<T> implements IValidation {
	protected analyzer: IProjectAnalyzer<T>;

	constructor({ analyzer }: ValidationConstructionOpts<T>) {
		this.analyzer = analyzer;
	}

	abstract async validate(): Promise<ValidationException[]>;
}
