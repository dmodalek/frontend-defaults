import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { ReadmeAnalyzerResult, ReadmeAnalyzer } from '../src/readme';

const FIXTURE = getFixturePath('readme-project');
const FIXTURE_NO_README = getFixturePath('default-project');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<ReadmeAnalyzerResult>> => {
	return new ProjectAnalyzer<ReadmeAnalyzerResult>({
		context,
		analyzers: [ReadmeAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('ReadmeAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(FIXTURE_NO_README)).not.toThrow();
		});

		it('should analyze a project with readme correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE);

			expect(analyzer.analytics.readme).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without readme correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NO_README);

			expect(analyzer.analytics.readme).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
