import { Context, IContext } from './Context';
import { ConstructablePatch, IPatch, PatchResult } from './Patch';
import { IProjectAnalyzer } from './ProjectAnalyzer';
import { Constructable } from './types/Constructable';
import { ValidationException } from './Validation';

type ProjectPatch = {
	patch: Constructable<IPatch<any>>,
	arguments: any
}

type ProjectPatcherOptions = {
	patches: ProjectPatch[];
	context: IContext;
};

export interface IProjectPatcher {
	apply(): Promise<any>;
	applyPatchesFromValidation(validations: ValidationException[]): Promise<any>;
}

/**
 * Handles multiple patches for the project in a certain context.
 * It is also capable of executing patches based on a validation result.
 * @class
 * @implements {IProjectPatcher}
 * @author Jan Biasi <jan.biasi@namics.com>
 */
export class ProjectPatcher implements IProjectPatcher {
	private patches: ProjectPatch[];
	private context: Context;

	constructor({ patches, context }: ProjectPatcherOptions) {
		this.patches = patches;
	}

	public async apply() {
		// TODO: apply literally all patches (patches can be set in a control infrastructor e.g. CLI)
	}

	public async applyPatchesFromValidation(validations: ValidationException[]) {
		// TODO: add logic to extract patches from validation
	}

	/**
	 * Run all validations and collect their results
	 * @async
	 * @return Promise<(void | Error)[]>
	 */
	private async runPatches(patches: ProjectPatch[]): Promise<PatchResult[]> {
		return patches
			.map((projectPatch: ProjectPatch): { instance: IPatch<any>, arguments: any } => {
				return {
					// patch instance
					instance: new projectPatch.patch({
						context: this.context
					}),
					// arguments for the patch method itself
					arguments: projectPatch.arguments
				}
			})
			.reduce(async (prev, currentPatcher) => {
				return [
					// previous patch results
					...await prev,
					// current patch results
					...await currentPatcher.instance.validate().patch(currentPatcher.arguments)
				];
			}, Promise.resolve([]));
	}
}

export function buildSinglePatch<GenericPatch extends ConstructablePatch<Options>, Options>(context: IContext, PatchBlueprint: GenericPatch) {
	return new PatchBlueprint({
		context
	});
};