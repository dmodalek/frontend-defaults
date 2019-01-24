import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { ESLintAnalyzer, ESLintAnalyzerResult } from '../src/eslint';

const FIXTURE_INSTALLED = getFixturePath('eslint-project');
const FIXTURE_NOT_INSTALLED = getFixturePath('eslint-project-not-installed');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<ESLintAnalyzerResult>> => {
	return new ProjectAnalyzer<ESLintAnalyzerResult>({
		context,
		analyzers: [ESLintAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('ESLintAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_INSTALLED);

			expect(analyzer.analytics.eslint).toEqual(true);
			expect(analyzer.analytics.eslintIgnore).toEqual(true);
			expect(analyzer.analytics.eslintInstallation).toEqual('5.12.1');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without ignore & installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.eslint).toEqual(true);
			expect(analyzer.analytics.eslintIgnore).toEqual(false);
			expect(analyzer.analytics.eslintInstallation).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
