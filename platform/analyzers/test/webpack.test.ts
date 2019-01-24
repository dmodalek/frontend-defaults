import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { getFixturePath } from './suite';
import { WebpackAnalyzer, WebpackAnalyzerResult } from '../src/webpack';

const FIXTURE = getFixturePath('webpack-project');

const getFixtureAnalyzer = async (context: string): Promise<ProjectAnalyzer<WebpackAnalyzerResult>> => {
	return new ProjectAnalyzer<WebpackAnalyzerResult>({
		context,
		analyzers: [WebpackAnalyzer],
	}).boot();
};

describe('Analyzers', () => {
	describe('WebpackAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await getFixtureAnalyzer(FIXTURE)).not.toThrow();
		});

		it('should analyze a project with installation correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE);

			expect(analyzer.analytics.webpack).toEqual(true);
			expect(analyzer.analytics.webpackInstallation).toEqual('4.29.0');
			expect(analyzer.analytics).toMatchSnapshot();
		});

		it('should analyze a project and find configs as well as plugins correctly', async () => {
			const analyzer = await getFixtureAnalyzer(FIXTURE);

			// ['webpack.config.js', 'webpack.prod.config.js']
			expect(analyzer.analytics.webpackConfigurations).toHaveLength(2);
			// ['webpack', 'html-webpack-plugin', 'ts-config-webpack-plugin']
			expect(analyzer.analytics.webpackInstalledDependencies).toHaveLength(3);
			expect(analyzer.analytics).toMatchSnapshot();
		});
	});
});
