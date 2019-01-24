import { IPatch } from './Patch';
import { Constructable } from './types/Constructable';
import { ValidationException } from './Validation';
import { IProjectAnalyzer } from './ProjectAnalyzer';

type ProjectPatcherOptions<A> = {
	patches: Constructable<IPatch>[];
	analyzer: A;
};

export class ProjectPatcher<A> {
	private patches: Constructable<IPatch>[];
	private analyzer: IProjectAnalyzer<A>;

	constructor({ patches, analyzer }: ProjectPatcherOptions<A>) {
		this.patches = patches;
	}

	async apply(useCertainPatches?: string[]) {
		// TODO: Overrides via param should be enabled for valiation autorun!
	}

	/**
	 * Run all validations and collect their results
	 * @async
	 * @return Promise<(void | Error)[]>
	 */
	async runPatches(): Promise<(void | Error)[]> {
		return this.patches
			.map((PatchBlueprint) => {
				return new PatchBlueprint({
					analyzer: this.analyzer,
				});
			})
			.reduce(async (prev, currentPatcherInst) => {
				return [...(await prev), await currentPatcherInst.patch()];
			}, Promise.resolve([]));
	}
}
