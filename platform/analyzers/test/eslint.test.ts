import { getFixtureContext } from './utils';
import { eslintAnalyzer } from '../src/eslint';

const FIXTURE_INSTALLED = getFixtureContext('eslint-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('eslint-project-not-installed');

describe('Analyzers', () => {
	describe('ESLintAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await eslintAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with installation correctly', async () => {
			const analytics = await eslintAnalyzer(FIXTURE_INSTALLED);

			expect(analytics.eslint).toEqual(true);
			expect(analytics.eslintIgnore).toEqual(true);
			expect(analytics.eslintInstallation!.declared).toEqual('5.12.1');
			expect(analytics.eslintInstallation!.installed).toEqual('5.12.1');
			expect(analytics).toMatchSnapshot({
				eslintInstallation: {
					latest: expect.any(String)
				}
			});
		});

		it('should analyze a project without ignore & installation correctly', async () => {
			const analytics = await eslintAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analytics.eslint).toEqual(true);
			expect(analytics.eslintIgnore).toEqual(false);
			expect(analytics.eslintInstallation!.installed).toBeFalsy();
			expect(analytics).toMatchSnapshot({
				eslintInstallation: {
					latest: expect.any(String)
				}
			});
		});
	});
});
