import { getFixtureContext } from './utils';
import { licenseAnalyzer } from '../src/license';

const FIXTURE_LICENSED = getFixtureContext('license-project');
const FIXTURE_UNLICENSE = getFixtureContext('default-project');

describe('Analyzers', () => {
	describe('LicenseAnalyzer', () => {
		it('should not crash', async () => {
			expect(async () => await licenseAnalyzer(FIXTURE_LICENSED)).not.toThrow();
			expect(async () => await licenseAnalyzer(FIXTURE_UNLICENSE)).not.toThrow();
		});

		it('should analyze a project with license correctly', async () => {
			const analytics = await licenseAnalyzer(FIXTURE_LICENSED);

			expect(analytics.license).toEqual(true);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project without npmrc correctly', async () => {
			const analytics = await licenseAnalyzer(FIXTURE_UNLICENSE);

			expect(analytics.license).toEqual(false);
			expect(analytics).toMatchSnapshot();
		});
	});
});
