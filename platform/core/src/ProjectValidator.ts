import { Constructable } from './types/Constructable';
import { IValidation, ValidationException } from './Validation';
import { ProjectAnalyzer } from './ProjectAnalyzer';

type ProjectValidatorOptions = {
	validations: Constructable<IValidation>[];
	analyzer: ProjectAnalyzer;
};

export class ProjectValidator {
	private validations: Constructable<IValidation>[];
	protected analyzer: ProjectAnalyzer;

	constructor({ analyzer, validations }: ProjectValidatorOptions) {
		this.validations = validations;
		this.analyzer = analyzer;
	}

	async validate() {
		// TODO: apply validators to the current project and save required patches
	}

	/**
	 * Run all validations and collect their results
	 * @async
	 * @return Promise<ValidationException[]>
	 */
	async runValidations(): Promise<ValidationException[]> {
		return this.validations
			.map((ValidationBlueprint) => {
				return new ValidationBlueprint({
					analyzer: this.analyzer,
				});
			})
			.reduce(async (prev, currentValidationInst) => {
				return [...(await prev), ...(await currentValidationInst.validate())];
			}, Promise.resolve([]));
	}
}
