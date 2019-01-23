import { IProjectAnalyzer } from './ProjectAnalyzer';

export interface IPatch {
	apply(): Promise<Error | void>;
}

export abstract class Patch<T> implements IPatch {
	constructor(private analyzer: IProjectAnalyzer<T>) {}

	abstract async apply(): Promise<Error | void>;
}
