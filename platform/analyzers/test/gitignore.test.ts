import { getFixtureContext } from './utils';
import { gitIgnoreAnalyzer } from '../src/gitignore';

const FIXTURE_INSTALLED = getFixtureContext('gitignore-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('default-project'); // has no .gitignore

describe('Analyzers', () => {
	describe('GitIgnoreAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await gitIgnoreAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with gitignore correctly', async () => {
			const analytics = await gitIgnoreAnalyzer(FIXTURE_INSTALLED);

			expect(analytics.gitignore).toEqual(true);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project without gitignore correctly', async () => {
			const analytics = await gitIgnoreAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analytics.gitignore).toEqual(false);
			expect(analytics).toMatchSnapshot();
		});
	});
});
