import { getFixtureContext } from './utils';
import { prettierAnalyzer } from '../src/prettier';

const FIXTURE_NONE = getFixtureContext('default-project');
const FIXTURE_ALL = getFixtureContext('prettier-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('prettier-project-not-installed');
const FIXTURE_NO_IGNORE = getFixtureContext('prettier-project-no-ignore');
const FIXTURE_PACKAGE_CONFIG = getFixtureContext('prettier-project-package-config');

describe('Analyzers', () => {
	describe('PrettierAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await prettierAnalyzer(FIXTURE_ALL)).not.toThrow();
			expect(async () => await prettierAnalyzer(FIXTURE_NOT_INSTALLED)).not.toThrow();
			expect(async () => await prettierAnalyzer(FIXTURE_NO_IGNORE)).not.toThrow();
			expect(async () => await prettierAnalyzer(FIXTURE_PACKAGE_CONFIG)).not.toThrow();
		});

		it('should find no prettier if nothing related is installed', async () => {
			const analytics = await prettierAnalyzer(FIXTURE_NONE);

			expect(analytics.prettier).toEqual(false);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project with installation correctly', async () => {
			const analytics = await prettierAnalyzer(FIXTURE_ALL);

			expect(analytics.prettier).toEqual(true);
			expect(analytics.prettierIgnore).toEqual(true);
			expect(analytics.prettierConfigLocation).toEqual('config');
			expect(analytics.prettierInstallation!.declared).toEqual('1.1.0');
			expect(analytics.prettierInstallation!.installed).toEqual('1.16.4');
			expect(analytics).toMatchSnapshot({
				prettierInstallation: {
					latest: expect.any(String),
				},
			});
		});

		it('should analyze a project with config inside package.json correctly', async () => {
			const analytics = await prettierAnalyzer(FIXTURE_PACKAGE_CONFIG);

			expect(analytics.prettier).toEqual(true);
			expect(analytics.prettierIgnore).toEqual(true);
			expect(analytics.prettierConfigLocation).toEqual('package');
			expect(analytics.prettierInstallation!.declared).toEqual('1.1.0');
			expect(analytics.prettierInstallation!.installed).toEqual('1.16.4');
			expect(analytics).toMatchSnapshot({
				prettierInstallation: {
					latest: expect.any(String),
				},
			});
		});

		it('should analyze a project without installation correctly', async () => {
			const analytics = await prettierAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analytics.prettier).toEqual(true);
			expect(analytics.prettierIgnore).toEqual(true);
			expect(analytics.prettierConfigLocation).toEqual('config');
			expect(analytics.prettierInstallation!.declared).toEqual('1.1.0');
			expect(analytics.prettierInstallation!.installed).toBeNull();
			expect(analytics).toMatchSnapshot({
				prettierInstallation: {
					latest: expect.any(String),
				},
			});
		});

		it('should analyze a project without ignore & installation correctly', async () => {
			const analytics = await prettierAnalyzer(FIXTURE_NO_IGNORE);

			expect(analytics.prettier).toEqual(true);
			expect(analytics.prettierIgnore).toEqual(false);
			expect(analytics.prettierConfigLocation).toEqual('config');
			expect(analytics.prettierInstallation!.installed).toEqual('1.16.4');
			expect(analytics).toMatchSnapshot({
				prettierInstallation: {
					latest: expect.any(String),
				},
			});
		});
	});
});
