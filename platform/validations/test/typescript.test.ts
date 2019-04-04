import { checkInternetConnection, getFixtureDir, getLatestVersion } from './utils';
import { typescriptValidation } from '../src/typescript';
import {
	tslintAnalyzer,
	TSLintAnalyzerResult,
	typescriptAnalyzer,
	TypeScriptAnalyzerResult,
} from '@namics/frontend-defaults-platform-analyzers';
import { analyze, ValidationExceptionLevel } from '@namics/frontend-defaults-platform-core';

const generateAnalyticsFor = async (
	fixtureContext: string
): Promise<TypeScriptAnalyzerResult & TSLintAnalyzerResult> => {
	return await analyze(fixtureContext, typescriptAnalyzer, tslintAnalyzer);
};

const FIXTURE_TS = getFixtureDir('ts-project');
const FIXTURE_NOT_INSTALLED = getFixtureDir('ts-project-not-installed');

beforeAll(async () => {
	if (!(await checkInternetConnection())) {
		console.debug(`Please only run tests while connected to the internet!`);
		process.exit(1); // kill child worker
	}
});

describe('Validations', () => {
	describe('TypeScriptValidation', () => {
		it('should be creatable without errors', () => {
			expect(async () => {
				const analytics = await generateAnalyticsFor(FIXTURE_TS);
				await typescriptValidation(FIXTURE_TS, analytics);
			}).not.toThrow();
		});

		it('should validate a project with upgrades correctly', async () => {
			const analytics = await generateAnalyticsFor(FIXTURE_TS);
			const results = await typescriptValidation(FIXTURE_TS, analytics);
			const [upgradeInfo] = results;

			expect(results).toHaveLength(1);
			expect(upgradeInfo.level).toEqual(ValidationExceptionLevel.info);
			expect(upgradeInfo.patch![0]).toEqual([
				'TypeScriptUpdatePatch',
				{
					current: '3.0.0',
					latest: await getLatestVersion('typescript'),
				},
			]);
			expect(upgradeInfo.message).toMatchInlineSnapshot(
				`"Please update TypeScript to v3.3.3 (installed: v3.0.0)"`
			);
			expect(results).toMatchSnapshot();
		});

		it('should analyze a project without installation correctly', async () => {
			const analytics = await generateAnalyticsFor(FIXTURE_NOT_INSTALLED);
			const results = await typescriptValidation(FIXTURE_TS, analytics);
			const singleIssue = results[0];

			expect(results).toHaveLength(1);
			expect(singleIssue.patch).toEqual(['TypeScriptInstallationPatch']);
			expect(singleIssue.message).toMatchInlineSnapshot(
				`"Using TypeScript without explicit installtion is not allowed"`
			);
			expect(results).toMatchSnapshot();
		});
	});
});
