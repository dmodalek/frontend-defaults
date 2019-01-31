import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type GitIgnoreAnalyzerResult = {
	gitignore: boolean;
};

export class GitIgnoreAnalzyer extends Analyzer<GitIgnoreAnalyzerResult> {
	async analyze(): Promise<GitIgnoreAnalyzerResult> {
		const doesGitignoreExist = await fileExists(this.context.getPath('.gitignore'));

		return {
			gitignore: doesGitignoreExist,
		};
	}
}
