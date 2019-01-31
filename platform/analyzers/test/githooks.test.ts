import { getFixtureContext } from './utils';
import { GitHooksAnalyzer, GitHooksAnalyzerResult } from '../src/githooks';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE_RC = getFixtureContext('githooks-project');
const FIXTURE_PKG = getFixtureContext('githooks-package-project');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<GitHooksAnalyzerResult>> => {
	return new ProjectAnalyzer<GitHooksAnalyzerResult>({
		context,
		analyzers: [GitHooksAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('GitHooksAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE_RC)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(await FIXTURE_PKG)).not.toThrow();
		});

		it('should analyze a project with .huskyrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_RC);

			expect(analyzer.analytics.githooks).toEqual(true);
			expect(analyzer.analytics.githooksLocation).toEqual('rc');
			expect(analyzer.analytics.githooksInstallation).toEqual('1.3.1');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with husky in package correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_PKG);

			expect(analyzer.analytics.githooks).toEqual(false);
			expect(analyzer.analytics.githooksLocation).toEqual('package');
			expect(analyzer.analytics.githooksInstallation).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
