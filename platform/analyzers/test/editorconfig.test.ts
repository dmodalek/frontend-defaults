import { getFixtureContext } from './utils';
import { EditorconfigAnalyzer, EditorconfigAnalyzerResult } from '../src/editorconfig';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE_WITH_EC = getFixtureContext('editorconfig-project');
const FIXTURE_NO_EC = getFixtureContext('default-project');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<EditorconfigAnalyzerResult>> => {
	return new ProjectAnalyzer<EditorconfigAnalyzerResult>({
		context,
		analyzers: [EditorconfigAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('EditorconfigAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE_WITH_EC)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(await FIXTURE_NO_EC)).not.toThrow();
		});

		it('should analyze a project with editorconfig correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_WITH_EC);

			expect(analyzer.analytics.editorConfig).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without editorconfig correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NO_EC);

			expect(analyzer.analytics.editorConfig).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
