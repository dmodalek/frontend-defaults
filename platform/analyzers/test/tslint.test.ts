import { getFixtureContext } from './utils';
import { tslintAnalyzer } from '../src/tslint';

const FIXTURE = getFixtureContext('tslint-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('tslint-project-not-installed');
const FIXTURE_NOT_USED = getFixtureContext('default-project');

describe('Analyzers', () => {
	describe('TSLintAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await tslintAnalyzer(FIXTURE)).not.toThrow();
		});

		it('should analyze a project without tslint correctly', async () => {
			const analytics = await tslintAnalyzer(FIXTURE_NOT_USED);

			expect(analytics.tslint).toEqual(false);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project with installation correctly', async () => {
			const analytics = await tslintAnalyzer(FIXTURE);

			expect(analytics.tslint).toEqual(true);
			expect(analytics.tslintInstallation!.declared).toEqual('5.12.1');
			expect(analytics.tslintInstallation!.installed).toEqual('5.15.0');
			expect(analytics).toMatchSnapshot({
				tslintInstallation: {
					latest: expect.any(String),
				},
			});
		});

		it('should analyze a project without installation correctly', async () => {
			const analytics = await tslintAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analytics.tslint).toEqual(true);
			expect(analytics.tslintInstallation!.installed).toBeFalsy();
			expect(analytics).toMatchSnapshot({
				tslintInstallation: {
					latest: expect.any(String),
				},
			});
		});
	});
});
