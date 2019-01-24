import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { TypeScriptAnalyzer, TypeScriptAnalyzerResult } from '../src/typescript';

const FIXTURE_INSTALLED = getFixturePath('ts-project');
const FIXTURE_NOT_INSTALLED = getFixturePath('ts-project-not-installed');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<TypeScriptAnalyzerResult>> => {
	return new ProjectAnalyzer<TypeScriptAnalyzerResult>({
		context,
		analyzers: [TypeScriptAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('TypeScriptAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_INSTALLED);

			expect(analyzer.analytics.typescript).toEqual(true);
			expect(analyzer.analytics.typescriptInstallation).toEqual('3.2.4');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.typescript).toEqual(true);
			expect(analyzer.analytics.typescriptInstallation).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
