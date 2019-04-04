import {
	DependencyInstallation,
	fileExists,
	getDependencyInstallation,
	getPackageJSON,
	IPackage,
} from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type GitHooksLocation = 'rc' | 'package';

export type GitHooksAnalyzerResult = {
	gitHooks: boolean;
	gitHooksInstallation?: DependencyInstallation;
	gitHooksLocation?: GitHooksLocation;
};

type PackageWithHuskyConfig = IPackage & {
	husky: any;
};

export const gitHooksAnalyzer = async (cwd: string): Promise<GitHooksAnalyzerResult> => {
	const doesGitHooksConfigExist = await fileExists(join(cwd, '.huskyrc'));
	const gitHooksInstallation = await getDependencyInstallation(cwd, 'husky');
	const pkg: PackageWithHuskyConfig = (await getPackageJSON(cwd)) as any;

	if (doesGitHooksConfigExist || pkg.husky) {
		return {
			gitHooks: doesGitHooksConfigExist,
			gitHooksLocation: pkg.husky ? 'package' : 'rc',
			gitHooksInstallation,
		};
	}

	return {
		gitHooks: false,
	};
};
