import { IProjectAnalyzer } from './ProjectAnalyzer';
import { ProjectValidator } from './ProjectValidator';

export interface IPatch {
	id: string;
	patch(): Promise<Error | void>;
}

type PatchConstructorOptions<A> = {
	analyzer: IProjectAnalyzer<A>;
};

export abstract class Patch<A> implements IPatch {
	public id: 'patch';
	private analyzer: IProjectAnalyzer<A>;

	constructor({ analyzer }: PatchConstructorOptions<A>) {
		this.analyzer = analyzer;
	}

	abstract async patch(): Promise<Error | void>;
}
