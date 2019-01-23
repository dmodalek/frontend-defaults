import { Analyzer, findFilesByPattern } from '@namics/frontend-defaults-core';

export type WebpackAnalyzerResult = {
	webpack: boolean;
	webpackInstallation?: string | false;
	webpackConfigurations?: string[];
	webpackInstalledDependencies?: string[];
};

export class WebpackAnalyzer extends Analyzer<WebpackAnalyzerResult> {
	async analyze(): Promise<WebpackAnalyzerResult> {
		const possibleWebpackConfigs = await findFilesByPattern(this.context, 'webpack.*.{js,ts}');

		if (possibleWebpackConfigs.length > 0) {
			const webpackInstalled = this.packageAnalyzer.anyDependencyExists('webpack');
			const possibleWebpackDependencies = Object.keys(this.packageAnalyzer.devDependencies).filter(
				(name) => !!~name.indexOf('webpack')
			);

			return {
				webpack: true,
				webpackInstallation: webpackInstalled ? webpackInstalled.version : false,
				webpackConfigurations: possibleWebpackConfigs,
				webpackInstalledDependencies: possibleWebpackDependencies,
			};
		}

		return {
			webpack: possibleWebpackConfigs.length > 0,
		};
	}
}
