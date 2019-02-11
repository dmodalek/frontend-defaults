import { IContext } from './Context';
import { IPackage } from './types/Package';
// import { PackageAnalyzer } from './PackageAnalyzer';

/**
 * Construction options for each analyzer
 * @type {AnalyzerConfiguration<T>}
 */
export type AnalyzerConfiguration<Analytics extends Object = {}> = {
	context: IContext;
	analytics: Analytics;
};

/**
 * Analyzer instance interface definition
 * @type {IAnalyzer<T>}
 */
export interface IAnalyzer<Result> {
	analyze(): Promise<Result>;
}

/**
 * Abstract base for a single analyzer implementation like the following
 * @abstract
 * @implements {IAnalyzer<Result>}
 * @class Analyzer<Result>
 * @example
 * class MyAnalyzer extends Analyzer<{ myProp: boolean }> {
 *   async analyze() {
 *     return { myProp: true }
 *   }
 * }
 */
export abstract class Analyzer<Result> implements IAnalyzer<Result> {
	/**
	 * Project root context as file path
	 * @type {string}
	 */
	protected context: IContext;

	/**
	 * Project configuration
	 * @type {IPackage | null}
	 */
	protected package: IPackage | null;

	/**
	 * Reference to the project analytics
	 * @type {Object}
	 */
	protected anayltics: Object;

	/**
	 * Reference to the projects package analyzer instance
	 * @type {PackageAnalyzer}
	 */
	// protected packageAnalyzer: PackageAnalyzer;

	constructor(configuration: AnalyzerConfiguration) {
		this.context = configuration.context;
		this.anayltics = configuration.analytics;
	}

	/**
	 * Main applying cycle for the analyzer on the project source, this
	 * method must be overwritten by the custom Analyzer implementation.
	 * @abstract
	 * @returns Promise<Result>
	 */
	abstract async analyze(): Promise<Result>;
}
