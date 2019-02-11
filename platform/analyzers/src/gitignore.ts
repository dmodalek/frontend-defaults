import { fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type GitIgnoreAnalyzerResult = {
	gitignore: boolean;
};

export const gitIgnoreAnalyzer = async (cwd: string): Promise<GitIgnoreAnalyzerResult> => {
	const doesGitignoreExist = await fileExists(join(cwd, '.gitignore'));

	return {
		gitignore: doesGitignoreExist,
	};
}