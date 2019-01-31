import { getFixtureContext } from './utils';
import { LicenseAnalyzer, LicenseAnalyzerResult } from '../src/license';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE_LICENSED = getFixtureContext('license-project');
const FIXTURE_UNLICENSE = getFixtureContext('default-project');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<LicenseAnalyzerResult>> => {
	return new ProjectAnalyzer<LicenseAnalyzerResult>({
		context,
		analyzers: [LicenseAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('LicenseAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE_LICENSED)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(await FIXTURE_UNLICENSE)).not.toThrow();
		});

		it('should analyze a project with license correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_LICENSED);

			expect(analyzer.analytics.license).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without npmrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_UNLICENSE);

			expect(analyzer.analytics.license).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
