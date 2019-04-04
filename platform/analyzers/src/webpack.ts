import {
	DependencyInstallation,
	findFilesByPattern,
	getDependencyInstallation,
	getPackageJSON,
} from '@namics/frontend-defaults-platform-core';

export type WebpackAnalyzerResult = {
	webpack: boolean;
	webpackInstallation?: DependencyInstallation;
	webpackConfigurations?: string[];
	webpackInstalledDependencies?: string[];
};

export const webpackAnalyzer = async (cwd: string): Promise<WebpackAnalyzerResult> => {
	const possibleWebpackConfigs = await findFilesByPattern(cwd, 'webpack.*.{js,ts}');

	if (possibleWebpackConfigs.length > 0) {
		const pkg = await getPackageJSON(cwd);
		const webpackInstallation = await getDependencyInstallation(cwd, 'webpack');
		const possibleWebpackDependencies = Object.keys(pkg.devDependencies || {}).filter(
			(name) => !!~name.indexOf('webpack')
		);

		return {
			webpack: true,
			webpackInstallation,
			webpackConfigurations: possibleWebpackConfigs,
			webpackInstalledDependencies: possibleWebpackDependencies,
		};
	}

	return {
		webpack: possibleWebpackConfigs.length > 0,
	};
};
