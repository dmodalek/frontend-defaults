import { getFixtureContext } from './utils';
import { TypeScriptAnalyzer, TypeScriptAnalyzerResult } from '../src/typescript';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE_INSTALLED = getFixtureContext('ts-project');
const FIXTURE_NOT_INSTALLED = getFixtureContext('ts-project-not-installed');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<TypeScriptAnalyzerResult>> => {
	return new ProjectAnalyzer<TypeScriptAnalyzerResult>({
		context,
		analyzers: [TypeScriptAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('TypeScriptAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE_INSTALLED)).not.toThrow();
		});

		it('should analyze a project with installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_INSTALLED);

			expect(analyzer.analytics.typescript).toEqual(true);
			expect(analyzer.analytics.typescriptInstallation).toEqual('3.2.4');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.typescript).toEqual(true);
			expect(analyzer.analytics.typescriptInstallation).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
