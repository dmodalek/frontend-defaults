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
	level: ValidationExceptionLevel;
};

export class ValidationException extends Error {
	private source: string = 'unknown';
	private level: ValidationExceptionLevel = ValidationExceptionLevel.debug;

	constructor({ message, source, level }: ValidationExceptionOptions) {
		super(message);

		this.source = source;
		this.level = level;

		Object.setPrototypeOf(this, new.target.prototype);
	}

	toString() {
		return `ValidationEception ${this.source}: ${this.message} [${this.level}]`;
	}
}

export interface IValidation {
	validate(): Promise<ValidationException[]>;
}

export abstract class Validation<T> implements IValidation {
	constructor(protected analyzer: IProjectAnalyzer<T>) {}

	abstract async validate(): Promise<ValidationException[]>;
}
