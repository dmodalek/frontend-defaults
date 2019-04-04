import { AnalyzerConfiguration, IAnalyzer } from './Analyzer';
import { IContext } from './Context';
import { Constructable } from './types/Constructable';
import { IPackage } from './types/Package';
import { displayPath, getJSON } from './utils/fs';
import { join } from 'path';
// import { PackageAnalyzer } from './PackageAnalyzer';

type ProjectAnalyzerConstructionOptions = {
	context: IContext;
	analyzers: Constructable<IAnalyzer<any>>[];
};

export interface IProjectAnalyzer<Analytics> {
	context: IContext;
	analytics: Analytics;
	initialAnalyzationDone: boolean;
}

/**
 * Main project analyzer blueprint, used for analyzing projects and handling
 * child analyzers
 * @class
 * @implements {IProjectAnalyzer<Analytics>}
 * @author Jan Biasi <jan.biasi@namics.com>
 */
export class ProjectAnalyzer<Analytics extends Object = {}> implements IProjectAnalyzer<Analytics> {
	public context: IContext;
	public analytics: Analytics;
	public initialAnalyzationDone = false;
	private analyzers: Constructable<IAnalyzer<any>>[];

	/**
	 * Creates a new project analyzer within a context and certain analyzers.
	 * Context is optional, default value will your working directory `process.cwd()`.
	 * @param { context: IContext, analyzers: IAnalyzer<any>[] }
	 */
	constructor({ context, analyzers }: ProjectAnalyzerConstructionOptions) {
		this.analyzers = analyzers;
		this.context = context;
	}

	/**
	 * Boot the analyzer and runs against the configured package
	 * @async
	 * @returns Promise<ProjectAnalyzer<Analytics>>
	 */
	async boot() {
		try {
			this.analytics = await this.runAnalyzers();
			this.initialAnalyzationDone = true;

			// make chainable for analytics information
			return this;
		} catch (err) {
			// how should we handle child errors here?
			throw err;
		}
	}

	/**
	 * Run all configured analyzers against the project to generate analytics
	 * @async
	 * @returns Promise<Analytics>
	 */
	async runAnalyzers() {
		return this.analyzers
			.map((AnalyzerBlueprint) => {
				return new AnalyzerBlueprint(this.analyzerBaseConfiguration);
			})
			.reduce(async (prev, currentAnalyzerInst) => {
				return {
					...(await prev),
					...(await currentAnalyzerInst.analyze()),
				};
			}, Promise.resolve({}));
	}

	/**
	 * Get the configuration for a single analyzer constructable
	 * @readonly
	 */
	private get analyzerBaseConfiguration(): AnalyzerConfiguration {
		return {
			context: this.context,
			analytics: this.analytics,
		};
	}
}
