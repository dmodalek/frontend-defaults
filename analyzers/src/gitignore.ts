import { join } from 'path';
import { Analyzer, fileExists } from '@namics/frontend-defaults-core';

export type GitignoreAnalyzerResult = {
	gitignore: boolean;
};

export class GitignoreAnalzyer extends Analyzer<GitignoreAnalyzerResult> {
	async analyze(): Promise<GitignoreAnalyzerResult> {
		const doesGitignoreExist = await fileExists(join(this.context, '.gitignore'));

		return {
			gitignore: doesGitignoreExist,
		};
	}
}
