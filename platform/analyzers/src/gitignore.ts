import { join } from 'path';
import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type GitIgnoreAnalyzerResult = {
	gitignore: boolean;
};

export class GitIgnoreAnalzyer extends Analyzer<GitIgnoreAnalyzerResult> {
	async analyze(): Promise<GitIgnoreAnalyzerResult> {
		const doesGitignoreExist = await fileExists(join(this.context, '.gitignore'));

		return {
			gitignore: doesGitignoreExist,
		};
	}
}
