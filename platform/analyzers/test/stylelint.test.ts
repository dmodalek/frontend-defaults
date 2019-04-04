import { getFixtureContext } from './utils';
import { stylelintAnalyzer } from '../src/stylelint';

const FIXTURE_INSTALLED = getFixtureContext('stylelint-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('stylelint-project-not-installed');

describe('Analyzers', () => {
	describe('StylelintAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await stylelintAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
			expect(async () => await stylelintAnalyzer(FIXTURE_NOT_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with installation correctly', async () => {
			const analytics = await stylelintAnalyzer(FIXTURE_INSTALLED);

			expect(analytics.stylelint).toEqual(true);
			expect(analytics.stylelintIgnore).toEqual(true);
			expect(analytics.stylelintInstallation!.declared).toEqual('9.0.0');
			expect(analytics.stylelintInstallation!.installed).toEqual('9.10.1');
			expect(analytics).toMatchSnapshot({
				stylelintInstallation: {
					latest: expect.any(String),
				},
			});
		});

		it('should analyze a project without ignore & installation correctly', async () => {
			const analytics = await stylelintAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analytics.stylelint).toEqual(true);
			expect(analytics.stylelintIgnore).toEqual(false);
			expect(analytics.stylelintInstallation!.installed).toBeFalsy();
			expect(analytics).toMatchSnapshot({
				stylelintInstallation: {
					latest: expect.any(String),
				},
			});
		});
	});
});
