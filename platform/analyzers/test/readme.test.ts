import { ProjectAnalyzer, IContext } from '@namics/frontend-defaults-platform-core';
import { getFixtureContext } from './suite';
import { ReadmeAnalyzerResult, ReadmeAnalyzer } from '../src/readme';

const FIXTURE = getFixtureContext('readme-project');
const FIXTURE_NO_README = getFixtureContext('default-project');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<ReadmeAnalyzerResult>> => {
	return new ProjectAnalyzer<ReadmeAnalyzerResult>({
		context,
		analyzers: [ReadmeAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('ReadmeAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(await FIXTURE_NO_README)).not.toThrow();
		});

		it('should analyze a project with readme correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE);

			expect(analyzer.analytics.readme).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without readme correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NO_README);

			expect(analyzer.analytics.readme).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
