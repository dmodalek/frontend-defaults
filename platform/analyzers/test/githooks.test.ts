import { getFixtureContext } from './utils';
import { gitHooksAnalyzer } from '../src/githooks';

const FIXTURE_RC = getFixtureContext('githooks-project');
const FIXTURE_PKG = getFixtureContext('githooks-package-project');

describe('Analyzers', () => {
	describe('GitHooksAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await gitHooksAnalyzer(FIXTURE_RC)).not.toThrow();
			expect(async () => await gitHooksAnalyzer(FIXTURE_PKG)).not.toThrow();
		});

		it('should analyze a project with .huskyrc correctly', async () => {
			const analytics = await gitHooksAnalyzer(FIXTURE_RC);

			expect(analytics.gitHooks).toEqual(true);
			expect(analytics.gitHooksLocation).toEqual('rc');
			expect(analytics.gitHooksInstallation!.declared).toEqual('1.3.1');
			expect(analytics.gitHooksInstallation!.location).toEqual('devDependencies');
			expect(analytics.gitHooksInstallation!.installed).toBeFalsy(); // not installed
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project with husky in package correctly', async () => {
			const analytics = await gitHooksAnalyzer(FIXTURE_PKG);

			expect(analytics.gitHooks).toEqual(false);
			expect(analytics.gitHooksLocation).toEqual('package');
			expect(analytics.gitHooksInstallation!.installed).toBeFalsy();
			expect(analytics).toMatchSnapshot();
		});
	});
});
