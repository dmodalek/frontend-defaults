import {
	Analyzer,
	DependencyInstallation,
	fileExists,
	getDependencyInstallation,
} from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type TypeScriptAnalyzerResult = {
	typescript: boolean;
	typescriptInstallation?: DependencyInstallation;
};

export const typescriptAnalyzer = async (cwd: string): Promise<TypeScriptAnalyzerResult> => {
	const doesTypeScriptExist = await fileExists(join(cwd, 'tsconfig.json'));

	if (doesTypeScriptExist) {
		const typescriptInstallation = await getDependencyInstallation(cwd, 'typescript');

		return {
			typescript: doesTypeScriptExist,
			typescriptInstallation,
		};
	}

	return {
		typescript: doesTypeScriptExist,
	};
};
