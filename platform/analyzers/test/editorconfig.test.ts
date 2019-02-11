import { getFixtureContext } from './utils';
import { editorConfigAnalyzer } from '../src/editorconfig';

const FIXTURE_WITH_EC = getFixtureContext('editorconfig-project');
const FIXTURE_NO_EC = getFixtureContext('default-project');

describe('Analyzers', () => {
	describe('EditorconfigAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await editorConfigAnalyzer(FIXTURE_WITH_EC)).not.toThrow();
			expect(async () => await editorConfigAnalyzer(FIXTURE_NO_EC)).not.toThrow();
		});

		it('should analyze a project with editorconfig correctly', async () => {
			const analytics = await editorConfigAnalyzer(FIXTURE_WITH_EC);

			expect(analytics.editorConfig).toEqual(true);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project without editorconfig correctly', async () => {
			const analytics = await editorConfigAnalyzer(FIXTURE_NO_EC);

			expect(analytics.editorConfig).toEqual(false);
			expect(analytics).toMatchSnapshot();
		});
	});
});
