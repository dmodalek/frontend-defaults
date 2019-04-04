import { fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type EditorconfigAnalyzerResult = {
	editorConfig: boolean;
};

export const editorConfigAnalyzer = async (cwd: string): Promise<EditorconfigAnalyzerResult> => {
	return {
		editorConfig: await fileExists(join(cwd, '.editorconfig')),
	};
};
