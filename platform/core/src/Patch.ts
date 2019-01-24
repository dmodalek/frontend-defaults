import { IProjectAnalyzer } from './ProjectAnalyzer';
import { ProjectValidator } from './ProjectValidator';

export interface IPatch {
	id: string;
	apply(): Promise<Error | void>;
}

export abstract class Patch<A> implements IPatch {
	public id: 'patch';

	constructor(protected analyzer: IProjectAnalyzer<A>) {}

	abstract async apply(): Promise<Error | void>;
}
