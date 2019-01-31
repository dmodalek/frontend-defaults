import { ProjectAnalyzer, IContext } from '@namics/frontend-defaults-platform-core';
import { getFixtureContext } from './suite';
import { GitIgnoreAnalyzerResult, GitIgnoreAnalzyer } from '../src/gitignore';

const FIXTURE_INSTALLED = getFixtureContext('gitignore-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('default-project'); // has no .gitignore

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<GitIgnoreAnalyzerResult>> => {
	return new ProjectAnalyzer<GitIgnoreAnalyzerResult>({
		context,
		analyzers: [GitIgnoreAnalzyer],
	}).boot();
};

describe('Analyzers', () => {
	describe('GitIgnoreAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with gitignore correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_INSTALLED);

			expect(analyzer.analytics.gitignore).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without gitignore correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.gitignore).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
