import { join } from 'path';
import { getJSON } from './utils/fs';
import { IAnalyzer, AnalyzerConfiguration } from './Analyzer';
import { IPackage } from './types/Package';
import { Constructable } from './types/Constructable';
import { PackageAnalyzer } from './PackageAnalyzer';

type ProjectAnalyzerConstructionOptions = {
	context?: string;
	analyzers: Constructable<IAnalyzer<any>>[];
};

export interface IProjectAnalyzer<Analytics> {
	context: string;
	analytics: Analytics;
	package: IPackage | null;
	packageAnalyzer: PackageAnalyzer;
}

/**
 * Main project analyzer blueprint, used for analyzing projects and handling
 * child analyzers
 * @class
 */
export class ProjectAnalyzer<Analytics extends Object = {}> implements IProjectAnalyzer<Analytics> {
	public context: string;
	public analytics: Analytics;
	public package: IPackage | null = null;
	public packageAnalyzer: PackageAnalyzer = new PackageAnalyzer(null);
	private analyzers: Constructable<IAnalyzer<any>>[];

	/**
	 * Creates a new project analyzer within a context and certain analyzers.
	 * Context is optional, default value will your working directory `process.cwd()`.
	 * @param { context?: string, analyzers: IAnalyzer<any>[] }
	 */
	constructor({ context, analyzers }: ProjectAnalyzerConstructionOptions) {
		this.analyzers = analyzers;
		this.context = context || process.cwd();
	}

	/**
	 * Boot the analyzer and runs against the configured package
	 * @async
	 * @returns Promise<ProjectAnalyzer<Analytics>>
	 */
	async boot() {
		try {
			this.package = await getJSON<IPackage>(join(this.context, 'package.json'));
			this.packageAnalyzer = new PackageAnalyzer(this.package);
			this.setSavePackageAccessForAnalyzers();
			this.analytics = await this.runAnalyzers();

			// make chainable for analytics information
			return this;
		} catch (err) {
			throw new Error(`Can't start analytics due missing package.json in ${this.context}`);
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
	 * Make sure that the package.json analytics contains each object needed
	 * to prevent undefined accessor failures
	 * @return void
	 */
	private setSavePackageAccessForAnalyzers(): void {
		if (!this.package) {
			this.package = {};
		}

		this.package.dependencies = this.package.dependencies || {};
		this.package.devDependencies = this.package.devDependencies || {};
		this.package.peerDependencies = this.package.peerDependencies || {};
		this.package.engines = this.package.engines || {};
	}

	/**
	 * Get the configuration for a single analyzer constructable
	 * @readonly
	 */
	private get analyzerBaseConfiguration(): AnalyzerConfiguration {
		return {
			context: this.context,
			package: this.package,
			analytics: this.analytics,
			packageAnalyzer: this.packageAnalyzer,
		};
	}
}
