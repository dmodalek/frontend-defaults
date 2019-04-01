import { getFixtureContext } from './utils';
import { typescriptAnalyzer } from '../src/typescript';

const FIXTURE_INSTALLED = getFixtureContext('ts-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('ts-project-not-installed');

describe('Analyzers', () => {
	describe('TypeScriptAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await typescriptAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with installation correctly', async () => {
			const analytics = await typescriptAnalyzer(FIXTURE_INSTALLED);

			expect(analytics.typescript).toEqual(true);
			expect(analytics.typescriptInstallation!.declared).toEqual('3.2.4');
			expect(analytics.typescriptInstallation!.installed).toEqual('3.0.0');
			expect(analytics).toMatchSnapshot({
				typescriptInstallation: {
					"latest": expect.any(String)
				}
			});
		});

		it('should analyze a project without installation correctly', async () => {
			const analytics = await typescriptAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analytics.typescript).toEqual(true);
			expect(analytics.typescriptInstallation!.installed).toBeFalsy();
			expect(analytics).toMatchSnapshot({
				typescriptInstallation: {
					"latest": expect.any(String)
				}
			});
		});
	});
});
