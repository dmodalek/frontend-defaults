import { ProjectValidator, ProjectAnalyzer, ValidationExceptionLevel } from '@namics/frontend-defaults-platform-core';
import { TypeScriptValidation } from '../src/typescript';
import { getFixtureDir } from './utils';
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
			expect(patches).toHaveLength(0); // only info will be return to upgrade
			expect(validator.validation).toHaveLength(1);

			const [upgradeInfo] = validator.validation;
			expect(upgradeInfo.level).toEqual(ValidationExceptionLevel.info);
			expect(upgradeInfo.patch).toBeUndefined();
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
			expect(patches).toContain('TypeScriptInstallationPatch');
			expect(validator.validation[0].toString()).toMatchInlineSnapshot(
				`"Validate TypeScriptValidation: Using TypeScript without explicit installtion is not allowed [ERROR]"`
			);
		});
	});
});
