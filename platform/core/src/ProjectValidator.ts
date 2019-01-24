import { Constructable } from './types/Constructable';
import { IValidation } from './Validation';
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
		const validators = this.validations.map(
			(Validation) =>
				new Validation({
					analyzer: this.analyzer,
				})
		);

		// TODO: apply validators to the current project and save required patches
	}
}
