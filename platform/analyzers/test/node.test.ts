import { ProjectAnalyzer, IContext } from '@namics/frontend-defaults-platform-core';
import { getFixtureContext } from './suite';
import { NodeAnalyzerResult, NodeAnalyzer } from '../src/node';

const FIXTURE_NODE_VERSION = getFixtureContext('node-version-only-project');
const FIXTURE_NVM_VERSION = getFixtureContext('nvm-only-project');
const FIXTURE_NONE = getFixtureContext('default-project');
const FIXTURE_BOTH = getFixtureContext('version-manager-project');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<NodeAnalyzerResult>> => {
	return new ProjectAnalyzer<NodeAnalyzerResult>({
		context,
		analyzers: [NodeAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('NodeAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE_NODE_VERSION)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(await FIXTURE_NVM_VERSION)).not.toThrow();
		});

		// TODO: Add test for both case (nvm and node-version)

		it('should analyze a project without node meta configuration', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NONE);

			expect(analyzer.analytics.nodeVersion).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with node-version correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NODE_VERSION);
			const { nodeVersion, nodeVersionManagerInfo } = analyzer.analytics;

			expect(nodeVersion).toEqual(true);
			expect(nodeVersionManagerInfo).toBeTruthy();
			expect(nodeVersionManagerInfo!["node-version"]).toEqual('10.0.0');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with nvmrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NVM_VERSION);
			const { nodeVersion, nodeVersionManagerInfo } = analyzer.analytics;

			expect(nodeVersion).toEqual(true);
			expect(nodeVersionManagerInfo).toBeTruthy();
			expect(nodeVersionManagerInfo!.nvm).toEqual('10.0.0');
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
