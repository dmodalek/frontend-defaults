import { ProjectValidator, ProjectAnalyzer, ValidationExceptionLevel } from '@namics/frontend-defaults-platform-core';
import { getFixtureDir, checkInternetConnection } from './utils';
import { NPMRCValidation } from '../src/npmrc';
import { NPMRCAnalyzerResult, NPMRCAnalyzer } from '@namics/frontend-defaults-platform-analyzers';

const getAnalyzerFor = async (fixtureContext: string): Promise<ProjectAnalyzer<NPMRCAnalyzerResult>> => {
	return new ProjectAnalyzer<NPMRCAnalyzerResult>({
		context: fixtureContext,
		analyzers: [NPMRCAnalyzer],
	}).boot();
};

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
				const analyzer = await getAnalyzerFor(getFixtureDir('npmrc-project'));
				new ProjectValidator({
					analyzer,
					validations: [NPMRCValidation],
				});
			}).not.toThrow();
		});

		it('should recognize no issues if everything is valid', async () => {
			const analyzer = await getAnalyzerFor(getFixtureDir('npmrc-project'));
			const validator = new ProjectValidator({
				analyzer,
				validations: [NPMRCValidation],
			});

			const patches = await validator.validate();
			expect(patches).toHaveLength(0);
			expect(validator.validation).toHaveLength(0);
		});

		it('should recognize a missing npmrc', async () => {
			const analyzer = await getAnalyzerFor(getFixtureDir('default-project'));
			const validator = new ProjectValidator({
				analyzer,
				validations: [NPMRCValidation],
			});

			const patches = await validator.validate();
			expect(patches).toHaveLength(1);
			expect(validator.validation).toHaveLength(1);
			expect(patches[0].patch).toEqual('CreateNPMRCPatch');
			expect(validator.validation[0].toString()).toMatchInlineSnapshot(
				`"Validate NPMRCValidation: No .npmrc file found to reference to the correct node version [ERROR]"`
			);
		});

		it('should detect the missing save-exact flag', async () => {
			const analyzer = await getAnalyzerFor(getFixtureDir('npmrc-project-no-save-exact'));
			const validator = new ProjectValidator({
				analyzer,
				validations: [NPMRCValidation],
			});

			const patches = await validator.validate();
			expect(patches).toHaveLength(1);
			expect(validator.validation).toHaveLength(1);
			expect(patches[0].patch).toEqual('AddSaveExactToNPMRCPatch');
			expect(validator.validation[0].toString()).toMatchInlineSnapshot(
				`"Validate NPMRCValidation: Save exact is not enabled in your .npmrc file [WARNING]"`
			);
		});
	});
});
