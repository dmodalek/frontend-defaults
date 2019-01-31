import { getFixtureContext } from './utils';
import { TSLintAnalyzer, TSLintAnalyzerResult } from '../src/tslint';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE = getFixtureContext('tslint-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('tslint-project-not-installed');
const FIXTURE_NOT_USED = getFixtureContext('default-project');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<TSLintAnalyzerResult>> => {
	return new ProjectAnalyzer<TSLintAnalyzerResult>({
		context,
		analyzers: [TSLintAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('TSLintAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE)).not.toThrow();
		});

		it('should analyze a project without tslint correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NOT_USED);

			expect(analyzer.analytics.tslint).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE);

			expect(analyzer.analytics.tslint).toEqual(true);
			expect(analyzer.analytics.tslintInstallation).toEqual('5.12.1');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.tslint).toEqual(true);
			expect(analyzer.analytics.tslintInstallation).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
