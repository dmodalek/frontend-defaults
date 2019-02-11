import { getFixtureContext } from './utils';
import { nitroAnalyzer } from '../src/nitro';
import { IContext, ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';

const FIXTURE = getFixtureContext('nitro-project');
const FIXTURE_NO_ENGINE = getFixtureContext('nitro-project-no-view-engine');
const FIXTURE_NOT_INSTALLED = getFixtureContext('nitro-project-not-installed');

describe('Analyzers', () => {
	describe('NitroAnalyzer', () => {
		it('should not crash the ProjectAnalyzer', async () => {
			expect(async () => await nitroAnalyzer(FIXTURE)).not.toThrow();
		});

		it.only('should analyze a project with installation and configs correctly', async () => {
			const analytics = await nitroAnalyzer(FIXTURE);

			expect(analytics.nitro).toEqual(true);
			expect(analytics.nitroViewEngine).toEqual('hbs');
			expect(analytics.nitroInstallation!.declared).toEqual('4.3.2');
			expect(analytics.nitroInstallation!.installed).toBeFalsy(); // FIXME: not mocked yet
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project without nitro installation correctly', async () => {
			const analytics = await nitroAnalyzer(FIXTURE_NOT_INSTALLED);

			expect(analytics.nitro).toEqual(true);
			expect(analytics.nitroViewEngine).toEqual('hbs');
			expect(analytics.nitroInstallation!.installed).toBeFalsy();
			expect(analytics).toMatchSnapshot();
		});

		it('should analyze a project without nitro template setting correctly', async () => {
			const analytics = await nitroAnalyzer(FIXTURE_NO_ENGINE);

			expect(analytics.nitro).toEqual(true);
			expect(analytics.nitroViewEngine).toEqual('default');
			expect(analytics.nitroInstallation!.declared).toEqual('4.3.2');
			expect(analytics).toMatchSnapshot();
		});
	});
});
