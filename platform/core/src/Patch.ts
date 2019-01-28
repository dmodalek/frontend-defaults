import { IProjectAnalyzer } from './ProjectAnalyzer';
import { ProjectValidator } from './ProjectValidator';

export interface IPatch {
	id: string;
	patch(): Promise<Error | void>;
}

export abstract class Patch<A extends any = void> implements IPatch {
	public id: 'abstractPatchClass';

	constructor(protected options: A) { }

	abstract async patch(): Promise<Error | void>;
}
