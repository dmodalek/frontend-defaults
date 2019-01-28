import { ProjectValidator, ProjectAnalyzer, ValidationExceptionLevel } from '@namics/frontend-defaults-platform-core';
import { TypeScriptValidation } from '../src/typescript';
import { getFixtureDir, checkInternetConnection, getLatestVersion } from './utils';
import { TypeScriptAnalyzer, TypeScriptAnalyzerResult } from '../../analyzers/src/typescript';
import { TSLintAnalyzer, TSLintAnalyzerResult } from '../../analyzers/src/tslint';

const getAnalyzerFor = async (
	fixtureContext: string
): Promise<ProjectAnalyzer<TypeScriptAnalyzerResult & TSLintAnalyzerResult>> => {
	return new ProjectAnalyzer<TypeScriptAnalyzerResult & TSLintAnalyzerResult>({
		context: fixtureContext,
		analyzers: [TypeScriptAnalyzer, TSLintAnalyzer],
	}).boot();
};

beforeAll(async () => {
	if (!await checkInternetConnection()) {
		console.debug(`Please only run tests while connected to the internet!`);
		process.exit(1); // kill child worker
	}
});

describe('Validations', () => {
	describe('TypeScriptValidation', () => {
		it('should be creatable without errors', () => {
			expect(async () => {
				const analyzer = await getAnalyzerFor(getFixtureDir('ts-project'));
				new ProjectValidator({
					analyzer,
					validations: [TypeScriptValidation],
				});
			}).not.toThrow();
		});

		it('should validate a project with upgrades correctly', async () => {
			const analyzer = await getAnalyzerFor(getFixtureDir('ts-project'));
			const validator = await new ProjectValidator({
				analyzer,
				context: getFixtureDir('ts-project'),
				validations: [TypeScriptValidation],
			});

			const patches = await validator.validate();
			expect(patches).toHaveLength(1);
			expect(validator.validation).toHaveLength(1);

			const [upgradeInfo] = validator.validation;
			expect(upgradeInfo.level).toEqual(ValidationExceptionLevel.info);
			expect(upgradeInfo.patches).toBeTruthy();
			expect(upgradeInfo.patches![0].patch).toEqual('TypeScriptUpdatePatch');
			expect(upgradeInfo.patches![0].arguments.current).toEqual('3.1.6');
			expect(upgradeInfo.patches![0].arguments.latest).toEqual(await getLatestVersion('typescript'));
			expect(upgradeInfo.toString()).toMatchInlineSnapshot(
				`"Validate TypeScriptValidation: Please update TypeScript to v3.2.4 (installed: v3.1.6) [INFO]"`
			);
		});

		it('should analyze a project without installation correctly', async () => {
			const analyzer = await getAnalyzerFor(getFixtureDir('ts-project-not-installed'));
			const validator = await new ProjectValidator({
				analyzer,
				context: getFixtureDir('ts-project-not-installed'),
				validations: [TypeScriptValidation],
			});

			const patches = await validator.validate();
			expect(patches).toHaveLength(1);
			expect(patches[0].patch).toEqual('TypeScriptInstallationPatch');
			expect(validator.validation[0].toString()).toMatchInlineSnapshot(
				`"Validate TypeScriptValidation: Using TypeScript without explicit installtion is not allowed [ERROR]"`
			);
		});
	});
});
