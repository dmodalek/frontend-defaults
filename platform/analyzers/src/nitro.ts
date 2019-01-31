import { Analyzer, fileExists, getJSON } from '@namics/frontend-defaults-platform-core';

export type NitroAnalyzerResult = {
	nitro: boolean;
	nitroVersion?: false | string;
	nitroViewEngine?: string;
};

export class NitroAnalzyer extends Analyzer<NitroAnalyzerResult> {
	async analyze(): Promise<NitroAnalyzerResult> {
		const yeomanPath = this.context.getPath('.yo-rc.json');
		const doesYeomanExist = await fileExists(yeomanPath);
		const yeomanConfig = await getJSON<{
			'generator-nitro'?: {
				templateEngine: string;
			};
		}>(yeomanPath);

		if (doesYeomanExist) {
			const nitroInstallation = this.packageAnalyzer.anyDependencyExists('generator-nitro');

			return {
				nitro: !!yeomanConfig['generator-nitro'],
				nitroVersion: nitroInstallation ? nitroInstallation.version : false,
				nitroViewEngine: yeomanConfig['generator-nitro']
					? yeomanConfig['generator-nitro'].templateEngine || 'default'
					: 'default',
			};
		}

		return {
			nitro: false,
		};
	}
}
