import { ProjectAnalyzer, IContext } from '@namics/frontend-defaults-platform-core';
import { getFixtureContext } from './suite';
import { NitroAnalyzerResult, NitroAnalzyer } from '../src/nitro';

const FIXTURE = getFixtureContext('nitro-project');
const FIXTURE_NO_ENGINE = getFixtureContext('nitro-project-no-view-engine');
const FIXTURE_NOT_INSTALLED = getFixtureContext('nitro-project-not-installed');

const getFixtureAnalyzer = async (context: IContext): Promise<ProjectAnalyzer<NitroAnalyzerResult>> => {
	return new ProjectAnalyzer<NitroAnalyzerResult>({
		context,
		analyzers: [NitroAnalzyer],
	}).boot();
};

describe('Analyzers', () => {
	describe('NitroAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(await FIXTURE)).not.toThrow();
		});

		it('should analyze a project with installation and configs correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE);

			expect(analyzer.analytics.nitro).toEqual(true);
			expect(analyzer.analytics.nitroViewEngine).toEqual('hbs');
			expect(analyzer.analytics.nitroVersion).toEqual('4.3.2');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without nitro installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NOT_INSTALLED);

			expect(analyzer.analytics.nitro).toEqual(true);
			expect(analyzer.analytics.nitroViewEngine).toEqual('hbs');
			expect(analyzer.analytics.nitroVersion).toEqual(false);
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project without nitro template setting correctly', async () => {
			const analyzer = await getFixtureAnalyzer(await FIXTURE_NO_ENGINE);

			expect(analyzer.analytics.nitro).toEqual(true);
			expect(analyzer.analytics.nitroViewEngine).toEqual('default');
			expect(analyzer.analytics.nitroVersion).toEqual('4.3.2');
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
