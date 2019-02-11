import {
	Analyzer,
	DependencyInstallation,
	fileExists,
	getDependencyInstallation
	} from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type TSLintAnalyzerResult = {
	tslint: boolean;
	tslintInstallation?: DependencyInstallation;
};

export const tslintAnalyzer = async (cwd: string): Promise<TSLintAnalyzerResult> => {
	const doesTSLintExist = await fileExists(join(cwd, 'tslint.json'));

	if (doesTSLintExist) {
		const tslintInstallation = await getDependencyInstallation(cwd, 'tslint');

		return {
			tslint: doesTSLintExist,
			tslintInstallation,
		};
	}

	return {
		tslint: doesTSLintExist,
	};
}