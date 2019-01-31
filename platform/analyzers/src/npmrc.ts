import { join } from 'path';
import { Analyzer, fileExists, getFileContents } from '@namics/frontend-defaults-platform-core';

export type NPMRCAnalyzerResult = {
	npmrc: boolean;
	npmrcSaveExactEnabled?: boolean;
};

export class NPMRCAnalyzer extends Analyzer<NPMRCAnalyzerResult> {
	async analyze(): Promise<NPMRCAnalyzerResult> {
		const npmrcPath = this.context.getPath('.npmrc');
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
}
