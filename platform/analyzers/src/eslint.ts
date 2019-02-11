import { DependencyInstallation, fileExists, getDependencyInstallation } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type ESLintAnalyzerResult = {
	eslint: boolean;
	eslintIgnore?: boolean;
	eslintInstallation?: DependencyInstallation
};

export const eslintAnalyzer = async (cwd: string): Promise<ESLintAnalyzerResult> => {
	const doesESLintExist = await fileExists(join(cwd, '.eslintrc.js'));

	if (doesESLintExist) {
		const doesESLintIgnoreExist = await fileExists(join(cwd, '.eslintignore'));
		const eslintInstallation = await getDependencyInstallation(cwd, 'eslint');

		return {
			eslint: doesESLintExist,
			eslintIgnore: doesESLintIgnoreExist,
			eslintInstallation
		};
	}

	return {
		eslint: doesESLintExist,
	};
}