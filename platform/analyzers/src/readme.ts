import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type ReadmeAnalyzerResult = {
	readme: boolean;
};

export const readmeAnalyzer = async (cwd: string): Promise<ReadmeAnalyzerResult> => {
	const readmeExists = await fileExists(join(cwd, 'README.md'));

	return {
		readme: readmeExists,
	};
}