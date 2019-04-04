import { join } from 'path';
import {
	DependencyInstallation,
	fileExists,
	getDependencyInstallation,
	getJSON,
} from '@namics/frontend-defaults-platform-core';

export type NitroAnalyzerResult = {
	nitro: boolean;
	nitroViewEngine?: string;
	nitroInstallation?: DependencyInstallation;
};

type NitroConfigType = {
	'generator-nitro'?: {
		templateEngine: string;
	};
};

export const nitroAnalyzer = async (cwd: string): Promise<NitroAnalyzerResult> => {
	const yeomanPath = join(cwd, '.yo-rc.json');
	const doesYeomanExist = await fileExists(yeomanPath);
	const yeomanConfig = await getJSON<NitroConfigType>(yeomanPath);

	if (doesYeomanExist) {
		const nitroInstallation = await getDependencyInstallation(cwd, 'generator-nitro');

		return {
			nitro: !!yeomanConfig['generator-nitro'],
			nitroInstallation,
			nitroViewEngine: yeomanConfig['generator-nitro']
				? yeomanConfig['generator-nitro'].templateEngine || 'default'
				: 'default',
		};
	}

	return {
		nitro: false,
	};
};
