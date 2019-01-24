import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { NPMRCAnalyzerResult, NPMRCAnalyzer } from '../src/npmrc';

const FIXTURE_WITH_NPMRC = getFixturePath('npmrc-project');
const FIXTURE_NO_NPMRC = getFixturePath('default-project');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<NPMRCAnalyzerResult>> => {
	return new ProjectAnalyzer<NPMRCAnalyzerResult>({
		context,
		analyzers: [NPMRCAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('NPMRCAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_WITH_NPMRC)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(FIXTURE_NO_NPMRC)).not.toThrow();
		});

		it('should analyze a project with npmrc and save-exact correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_WITH_NPMRC);

			expect(analyzer.analytics.npmrc).toEqual(true);
			expect(analyzer.analytics.npmrcSaveExactEnabled).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without npmrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NO_NPMRC);

			expect(analyzer.analytics.npmrc).toEqual(false);
			expect(analyzer.analytics.npmrcSaveExactEnabled).toEqual(undefined);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
