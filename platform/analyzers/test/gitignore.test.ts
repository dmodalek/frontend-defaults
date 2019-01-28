import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { GitIgnoreAnalyzerResult, GitIgnoreAnalzyer } from '../src/gitignore';

const FIXTURE_INSTALLED = getFixturePath('gitignore-project');
const FIXTURE_NOT_INSTALLED = getFixturePath('default-project'); // has no .gitignore

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<GitIgnoreAnalyzerResult>> => {
	return new ProjectAnalyzer<GitIgnoreAnalyzerResult>({
		context,
		analyzers: [GitIgnoreAnalzyer],
	}).boot();
};

describe('Analyzers', () => {
	describe('GitIgnoreAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with gitignore correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_INSTALLED);

			expect(analyzer.analytics.gitignore).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without gitignore correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.gitignore).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});