import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type GitHooksLocation = 'rc' | 'package';

export type GitHooksAnalyzerResult = {
	githooks: boolean;
	githooksInstallation?: false | string;
	githooksLocation?: GitHooksLocation;
};

export class GitHooksAnalyzer extends Analyzer<GitHooksAnalyzerResult> {
	async analyze(): Promise<GitHooksAnalyzerResult> {
		const doesGitHooksConfigExist = await fileExists(this.context.getPath('.huskyrc'));
		const isHuskyInstalled = this.packageAnalyzer.anyDependencyExists('husky');
		const doesGitHooksConfigExistInPkg = !!(this.package as any).husky;

		if (doesGitHooksConfigExist || doesGitHooksConfigExistInPkg) {
			return {
				githooks: doesGitHooksConfigExist,
				githooksLocation: doesGitHooksConfigExistInPkg ? 'package' : 'rc',
				githooksInstallation: isHuskyInstalled ? isHuskyInstalled.version : false,
			};
		}

		return {
			githooks: false,
		};
	}
}
