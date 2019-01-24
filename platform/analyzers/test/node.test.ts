import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { NodeAnalyzerResult, NodeAnalyzer } from '../src/node';

const FIXTURE_NODE_VERSION = getFixturePath('node-version-project');
const FIXTURE_NVM_VERSION = getFixturePath('nvm-version-project');
const FIXTURE_NONE = getFixturePath('default-project');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<NodeAnalyzerResult>> => {
	return new ProjectAnalyzer<NodeAnalyzerResult>({
		context,
		analyzers: [NodeAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('NodeAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_NODE_VERSION)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(FIXTURE_NVM_VERSION)).not.toThrow();
		});

		it('should analyze a project without node meta configuration', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NONE);

			expect(analyzer.analytics.nodeVersion).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with node-version correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NODE_VERSION);

			expect(analyzer.analytics.nodeVersion).toEqual(true);
			expect(analyzer.analytics.nodeVersionManager).toEqual('node-version');
			expect(analyzer.analytics.nodeVersionSelectedVersion).toEqual('10.0.0');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with nvmrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NVM_VERSION);

			expect(analyzer.analytics.nodeVersion).toEqual(true);
			expect(analyzer.analytics.nodeVersionManager).toEqual('nvm');
			expect(analyzer.analytics.nodeVersionSelectedVersion).toEqual('10.0.0');
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
