import { ProjectAnalyzer } from '@namics/frontend-defaults-core';
import { getFixturePath } from './suite';
import { NPMRCAnalyzerResult, NPMRCAnalyzer } from '../src/npmrc';

const FIXTURE_INSTALLED = getFixturePath('default-project');
const FIXTURE_NOT_INSTALLED = getFixturePath('eslint-project-not-installed'); // has no npmrc

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<NPMRCAnalyzerResult>> => {
	return new ProjectAnalyzer<NPMRCAnalyzerResult>({
		context,
		analyzers: [NPMRCAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('NPMRCAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with npmrc and save-exact correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_INSTALLED);

			expect(analyzer.analytics.npmrc).toEqual(true);
			expect(analyzer.analytics.npmrcSaveExactEnabled).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without npmrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.npmrc).toEqual(false);
			expect(analyzer.analytics.npmrcSaveExactEnabled).toEqual(undefined);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
