import { IProjectAnalyzer } from './ProjectAnalyzer';
import { ProjectValidator } from './ProjectValidator';
import { IContext } from './Context';

export interface IPatch<A> {
	id: string;
	patch(options?: A): Promise<PatchResult[]>;
	dry(options?: A): Promise<PatchResult[]>;
}

type PatchConstructorOptions = {
	context: IContext
}

export interface IBasePatchResult {
	error?: Error
}

export interface IFilePatchResult extends IBasePatchResult {
	affectedFile: string,
	before?: string,
	after?: string
}

export interface IShellPatchResult extends IBasePatchResult {
	command: string,
	output: string
}

export type PatchResult = IFilePatchResult | IShellPatchResult;

/**
 * Main abstract Patch blueprint class, provides a simple way to write patches.
 * @class
 * @abstract
 * @implements {IPatch<A>}
 * @author Jan Biasi <jan.biasi@namics.com>
 */
export abstract class Patch<A extends any = void> implements IPatch<A> {
	/**
	 * Main ID of the patch, used by validators for requiring certain patches
	 * without creating circular references by importing the patches package.
	 * @public
	 * @type {string}
	 */
	public id: string = '__ABSTRACT__';

	/**
	 * Context reference with needed information about the project.
	 * @type {IContext}
	 * @protected
	 */
	protected context: IContext;

	/**
	 * Blueprint constructor for a certain patch.
	 * @constructor
	 * @param {PatchConstructorOptions} options patch options
	 */
	constructor({ context }: PatchConstructorOptions) {
		this.context = context;

		if (this.id === '__ABSTRACT__') {
			throw new Error(`Invalid patch ${this.constructor.name}: no id property set`);
		}
	}

	/**
	 * Main patch method to modify the current project context
	 * @param {A} options any options for the current patch in object format or void
	 */
	abstract async patch(options?: A): Promise<PatchResult[]>;

	/**
	 * Dry run implementation logic belongs here, you should not use any
	 * writeFile, shell execution command in here, just return what the
	 * command will do or will change theoretically.
	 * @param options 
	 */
	abstract async dry(options?: A): Promise<PatchResult[]>;
}
