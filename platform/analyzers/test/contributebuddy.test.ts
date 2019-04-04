import { getFixtureContext } from './utils';
import { contributebuddyAnalyzer } from '../src/contributebuddy';

const FIXTURE_ALL = getFixtureContext('contributebuddy-project');
const FIXTURE_NONE = getFixtureContext('default-project');

describe('Analyzers', () => {
	describe('ContributebuddyAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await contributebuddyAnalyzer(FIXTURE_ALL)).not.toThrow();
			expect(async () => await contributebuddyAnalyzer(FIXTURE_NONE)).not.toThrow();
		});

		it('should analyze a project with contribute-buddy correctly', async () => {
			const analytics = await contributebuddyAnalyzer(FIXTURE_ALL);

			expect(analytics.contributebuddy).toEqual(true);
			expect(analytics).toMatchSnapshot({
				contributebuddyInstallation: {
					latest: expect.any(String),
				},
			});
		});

		it('should analyze a project without contributebuddy correctly', async () => {
			const analytics = await contributebuddyAnalyzer(FIXTURE_NONE);

			expect(analytics.contributebuddy).toEqual(false);
		});
	});
});
