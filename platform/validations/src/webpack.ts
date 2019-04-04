import { WebpackAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import {
	ValidationResult,
	ValidationSeverityLevel,
	validateInstallation,
} from '@namics/frontend-defaults-platform-core';

const alternatePluginMap = [
	['ts-loader', 'ts-config-webpack-plugin'],
	['scss-loader', 'scss-config-webpack-plugin'],
	['css-loader', 'scss-config-webpack-plugin'],
];

export const webpackValidation = async (cwd: string, analytics: WebpackAnalyzerResult): Promise<ValidationResult[]> => {
	if (analytics.webpack) {
		// TODO: eslint is available, so we need to validate all things
		let validationResults: ValidationResult[] = [];
		validationResults = validationResults.concat(
			validateInstallation({
				installation: analytics.webpackInstallation,
				name: 'Webpack',
				source: 'webpackValidation',
			})
		);

		if (!analytics.webpackInstalledDependencies) {
			// no deps to validate
			return validationResults;
		}

		// try to suggest the dev's to use our webpack config plugins
		alternatePluginMap.forEach(([communityPackage, namicsPlugin]) => {
			if (
				analytics.webpackInstalledDependencies!.indexOf(communityPackage) >= 0 &&
				analytics.webpackInstalledDependencies!.indexOf(namicsPlugin) === -1
			) {
				validationResults.push({
					level: ValidationSeverityLevel.info,
					message: `Try use ${namicsPlugin} instead of ${communityPackage}`,
					source: 'webpackValidation',
					url: 'https://github.com/namics/webpack-config-plugins',
				});
			}
		});

		return validationResults;
	}

	return [];
};
