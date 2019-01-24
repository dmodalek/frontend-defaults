import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { GitHooksAnalyzerResult, GitHooksAnalyzer } from '../src/githooks';

const FIXTURE_RC = getFixturePath('githooks-project');
const FIXTURE_PKG = getFixturePath('githooks-package-project');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<GitHooksAnalyzerResult>> => {
	return new ProjectAnalyzer<GitHooksAnalyzerResult>({
		context,
		analyzers: [GitHooksAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('GitHooksAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_RC)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(FIXTURE_PKG)).not.toThrow();
		});

		it('should analyze a project with .huskyrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_RC);

			expect(analyzer.analytics.githooks).toEqual(true);
			expect(analyzer.analytics.githooksLocation).toEqual('rc');
			expect(analyzer.analytics.githooksInstallation).toEqual('1.3.1');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with husky in package correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_PKG);

			expect(analyzer.analytics.githooks).toEqual(false);
			expect(analyzer.analytics.githooksLocation).toEqual('package');
			expect(analyzer.analytics.githooksInstallation).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
