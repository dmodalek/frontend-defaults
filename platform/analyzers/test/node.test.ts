import { getFixtureContext } from './utils';
import { nodeAnalyzer } from '../src/node';

const FIXTURE_NODE_VERSION = getFixtureContext('node-version-only-project');
const FIXTURE_NVM_VERSION = getFixtureContext('nvm-only-project');
const FIXTURE_NONE = getFixtureContext('default-project');
const FIXTURE_BOTH = getFixtureContext('version-manager-project');

describe('Analyzers', () => {
	describe('NodeAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await nodeAnalyzer(FIXTURE_NODE_VERSION)).not.toThrow();
			expect(async () => await nodeAnalyzer(FIXTURE_NVM_VERSION)).not.toThrow();
		});

		// TODO: Add test for both case (nvm and node-version)

		it('should analyze a project without node meta configuration', async () => {
			const analytics = await nodeAnalyzer(FIXTURE_NONE);
			const { nodeVersion } = analytics;

			expect(nodeVersion).toEqual(false);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project with node-version correctly', async () => {
			const analytics = await nodeAnalyzer(FIXTURE_NODE_VERSION);
			const { nodeVersion, nodeVersionManagerInfo } = analytics;

			expect(nodeVersion).toEqual(true);
			expect(nodeVersionManagerInfo).toBeTruthy();
			expect(nodeVersionManagerInfo!['node-version']).toEqual('10.0.0');
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project with nvmrc correctly', async () => {
			const analytics = await nodeAnalyzer(FIXTURE_NVM_VERSION);
			const { nodeVersion, nodeVersionManagerInfo } = analytics;

			expect(nodeVersion).toEqual(true);
			expect(nodeVersionManagerInfo).toBeTruthy();
			expect(nodeVersionManagerInfo!.nvm).toEqual('10.0.0');
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project with nvmrc and node-version correctly', async () => {
			const analytics = await nodeAnalyzer(FIXTURE_BOTH);
			const { nodeVersion, nodeVersionManagerInfo } = analytics;

			expect(nodeVersion).toEqual(true);
			expect(nodeVersionManagerInfo).toBeTruthy();
			expect(analytics).toMatchSnapshot();
		});
	});
});
