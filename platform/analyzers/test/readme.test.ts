import { getFixtureContext } from './utils';
import { readmeAnalyzer, ReadmeAnalyzerResult } from '../src/readme';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE = getFixtureContext('readme-project');
const FIXTURE_NO_README = getFixtureContext('default-project');

describe('Analyzers', () => {
	describe('ReadmeAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await readmeAnalyzer(FIXTURE)).not.toThrow();
			expect(async () => await readmeAnalyzer(FIXTURE_NO_README)).not.toThrow();
		});

		it('should analyze a project with readme correctly', async () => {
			const analytics = await readmeAnalyzer(FIXTURE);

			expect(analytics.readme).toEqual(true);
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project without readme correctly', async () => {
			const analytics = await readmeAnalyzer(FIXTURE_NO_README);

			expect(analytics.readme).toEqual(false);
			expect(analytics).toMatchSnapshot();
		});
	});
});
