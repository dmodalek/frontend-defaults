import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { LicenseAnalyzerResult, LicenseAnalyzer } from '../src/license';

const FIXTURE_LICENSED = getFixturePath('license-project');
const FIXTURE_UNLICENSE = getFixturePath('default-project');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<LicenseAnalyzerResult>> => {
	return new ProjectAnalyzer<LicenseAnalyzerResult>({
		context,
		analyzers: [LicenseAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('LicenseAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE_LICENSED)).not.toThrow();
			expect(async () => await getFixtureAnalyzer(FIXTURE_UNLICENSE)).not.toThrow();
		});

		it('should analyze a project with license correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_LICENSED);

			expect(analyzer.analytics.license).toEqual(true);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without npmrc correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE_UNLICENSE);

			expect(analyzer.analytics.license).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
