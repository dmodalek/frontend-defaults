import { fileExists, getFileContents } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type NPMRCAnalyzerResult = {
	npmrc: boolean;
	npmrcSaveExactEnabled?: boolean;
};

export const npmrcAnalyzer = async (cwd: string): Promise<NPMRCAnalyzerResult> => {
	const npmrcPath = join(cwd, '.npmrc');
	const npmrcExists = await fileExists(npmrcPath);

	if (npmrcExists) {
		const contents = await getFileContents(npmrcPath);
		const saveExactEnabled = /^(save-exact)\s?=\s?true$/gim.test(contents);

		return {
			npmrc: npmrcExists,
			npmrcSaveExactEnabled: saveExactEnabled,
		};
	}

	return {
		npmrc: npmrcExists,
	};
}