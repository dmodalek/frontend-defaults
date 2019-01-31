import { getFixtureContext } from './utils';
import { NPMRCAnalyzer, NPMRCAnalyzerResult } from '../src/npmrc';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE_WITH_NPMRC = getFixtureContext('npmrc-project');
const FIXTURE_NO_NPMRC = getFixtureContext('default-project');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<NPMRCAnalyzerResult>> => {
	return new ProjectAnalyzer<NPMRCAnalyzerResult>({
		context,
		analyzers: [NPMRCAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('NPMRCAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE_WITH_NPMRC)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(await FIXTURE_NO_NPMRC)).not.toThrow();
		});

		it('should analyze a project with npmrc and save-exact correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_WITH_NPMRC);

			expect(analyzer.analytics.npmrc).toEqual(true);
			expect(analyzer.analytics.npmrcSaveExactEnabled).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without npmrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NO_NPMRC);

			expect(analyzer.analytics.npmrc).toEqual(false);
			expect(analyzer.analytics.npmrcSaveExactEnabled).toEqual(undefined);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
