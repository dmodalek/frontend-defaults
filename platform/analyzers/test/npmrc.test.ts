import { getFixtureContext } from './utils';
import { npmrcAnalyzer } from '../src/npmrc';

const FIXTURE_WITH_NPMRC = getFixtureContext('npmrc-project');
const FIXTURE_NO_NPMRC = getFixtureContext('default-project');

describe('Analyzers', () => {
	describe('NPMRCAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await npmrcAnalyzer(FIXTURE_WITH_NPMRC)).not.toThrow();
			expect(async () => await npmrcAnalyzer(FIXTURE_NO_NPMRC)).not.toThrow();
		});

		it('should analyze a project with npmrc and save-exact correctly', async () => {
			const analytics = await npmrcAnalyzer(FIXTURE_WITH_NPMRC);

			expect(analytics.npmrc).toEqual(true);
			expect(analytics.npmrcSaveExactEnabled).toEqual(true);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project without npmrc correctly', async () => {
			const analytics = await npmrcAnalyzer(FIXTURE_NO_NPMRC);

			expect(analytics.npmrc).toEqual(false);
			expect(analytics.npmrcSaveExactEnabled).toEqual(undefined);
			expect(analytics).toMatchSnapshot();
		});
	});
});
