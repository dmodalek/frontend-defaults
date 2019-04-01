import { getFixtureContext } from './utils';
import { webpackAnalyzer } from '../src/webpack';

const FIXTURE = getFixtureContext('webpack-project');

describe('Analyzers', () => {
	describe('WebpackAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await webpackAnalyzer(FIXTURE)).not.toThrow();
		});

		// TODO: Add testcase for projects without webpack

		it('should analyze a project with installation correctly', async () => {
			const analytics = await webpackAnalyzer(FIXTURE);

			expect(analytics.webpack).toEqual(true);
			expect(analytics.webpackInstallation!.declared).toEqual('4.29.0');
			expect(analytics.webpackInstallation!.installed).toBeFalsy(); // FIXME: not mocked yet
			expect(analytics).toMatchSnapshot({
				webpackInstallation: {
					"latest": expect.any(String)
				}
			});
		});

		it('should analyze a project and find configs as well as plugins correctly', async () => {
			const analytics = await webpackAnalyzer(FIXTURE);

			// ['webpack.config.js', 'webpack.prod.config.js']
			expect(analytics.webpackConfigurations).toHaveLength(2);
			// ['webpack', 'html-webpack-plugin', 'ts-config-webpack-plugin']
			expect(analytics.webpackInstalledDependencies).toHaveLength(3);
			expect(analytics).toMatchSnapshot({
				webpackInstallation: {
					"latest": expect.any(String)
				}
			});
		});
	});
});
