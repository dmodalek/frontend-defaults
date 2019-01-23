import { IPatch } from './Patch';
import { Constructable } from './types/Constructable';

type ProjectPatcherOptions = {
	patches: Constructable<IPatch>[];
};

export class ProjectPatcher {
	private patches: Constructable<IPatch>[];

	constructor({ patches }: ProjectPatcherOptions) {
		this.patches = patches;
	}

	async apply() {}
}
