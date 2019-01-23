import { ProjectAnalyzer } from '@namics/frontend-defaults-core';
import { getFixturePath } from './suite';
import { TSLintAnalyzerResult, TSLintAnalyzer } from '../src/tslint';

const FIXTURE = getFixturePath('tslint-project');
const FIXTURE_NOT_INSTALLED = getFixturePath('tslint-project-not-installed');
const FIXTURE_NOT_USED = getFixturePath('default-project');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<TSLintAnalyzerResult>> => {
	return new ProjectAnalyzer<TSLintAnalyzerResult>({
		context,
		analyzers: [TSLintAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('TSLintAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE)).not.toThrow();
		});

		it('should analyze a project without tslint correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NOT_USED);

			expect(analyzer.analytics.tslint).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project with installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE);

			expect(analyzer.analytics.tslint).toEqual(true);
			expect(analyzer.analytics.tslintInstallation).toEqual('5.12.1');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.tslint).toEqual(true);
			expect(analyzer.analytics.tslintInstallation).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
