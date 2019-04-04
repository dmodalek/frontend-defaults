import { DependencyInstallation, fileExists, getDependencyInstallation } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type StylelintAnalyzerResult = {
	stylelint: boolean;
	stylelintIgnore?: boolean;
	stylelintInstallation?: DependencyInstallation;
};

export const stylelintAnalyzer = async (cwd: string): Promise<StylelintAnalyzerResult> => {
	const doesStyleLintExist = await fileExists(join(cwd, 'stylelint.config.js'));

	if (doesStyleLintExist) {
		const doesStyleLintIgnoreExist = await fileExists(join(cwd, '.stylelintignore'));
		const stylelintInstallation = await getDependencyInstallation(cwd, 'stylelint');

		return {
			stylelint: doesStyleLintExist,
			stylelintIgnore: doesStyleLintIgnoreExist,
			stylelintInstallation,
		};
	}

	return {
		stylelint: doesStyleLintExist,
	};
};
