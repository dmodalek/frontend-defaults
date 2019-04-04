import { checkInternetConnection, getFixtureDir } from './utils';
import { npmrcValidation } from '../../patches/src/npmrc';
import { npmrcAnalyzer, NPMRCAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { analyze } from '@namics/frontend-defaults-platform-core';

const generateAnalyticsFor = async (fixtureContext: string): Promise<NPMRCAnalyzerResult> => {
	return await analyze(fixtureContext, npmrcAnalyzer);
};

const FIXTURE_NPMRC = getFixtureDir('npmrc-project');
const FIXTURE_NO_NPMRC = getFixtureDir('default-project');

beforeAll(async () => {
	if (!(await checkInternetConnection())) {
		console.debug(`Please only run tests while connected to the internet!`);
		process.exit(1); // kill child worker
	}
});

describe('Validations', () => {
	describe('NPMRCValidation', () => {
		it('should be creatable without errors', () => {
			expect(async () => {
				const analytics = await generateAnalyticsFor(FIXTURE_NPMRC);
				await npmrcValidation(FIXTURE_NPMRC, analytics);
			}).not.toThrow();
		});

		it('should recognize no issues if everything is valid', async () => {
			const analytics = await generateAnalyticsFor(FIXTURE_NPMRC);
			const exceptions = await npmrcValidation(FIXTURE_NPMRC, analytics);

			expect(exceptions).toHaveLength(0);
			expect(exceptions).toMatchSnapshot();
		});

		it('should recognize a missing npmrc', async () => {
			const analytics = await generateAnalyticsFor(FIXTURE_NO_NPMRC);
			const exceptions = await npmrcValidation(FIXTURE_NPMRC, analytics);

			expect(exceptions).toHaveLength(1);
			expect(exceptions[0]!.patch![0]).toEqual(['NPMRCPatch', { create: true }]);
			expect(exceptions[0]!.source).toEqual('NPMRCValidation');
			expect(exceptions[0].message).toMatchInlineSnapshot(
				`"No .npmrc file found to reference to the correct node version"`
			);
			expect(exceptions).toMatchSnapshot();
		});

		it('should detect the missing save-exact flag', async () => {
			const analytics = await generateAnalyticsFor(getFixtureDir('npmrc-project-no-save-exact'));
			const exceptions = await npmrcValidation(FIXTURE_NPMRC, analytics);

			expect(exceptions).toHaveLength(1);
			expect(exceptions[0].patch).toEqual(['NPMRCPatch']);
			expect(exceptions[0].message).toMatchInlineSnapshot(
				`"Save exact is not enabled in your .npmrc file"`
			);
			expect(exceptions).toMatchSnapshot();
		});
	});
});
