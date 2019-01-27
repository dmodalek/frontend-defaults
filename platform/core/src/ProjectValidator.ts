import { Constructable } from './types/Constructable';
import { IValidation, ValidationException } from './Validation';
import { ProjectAnalyzer } from './ProjectAnalyzer';

type ProjectValidatorOptions = {
	validations?: Constructable<IValidation>[];
	analyzer: ProjectAnalyzer;
	context?: string;
};

export class ProjectValidator<T> {
	public context: string;
	private validations: Constructable<IValidation>[];
	protected analyzer: ProjectAnalyzer;
	public validation: ValidationException[] = [];

	/**
	 * Creates a new project validation within a context and certain validators.
	 * Context is optional, default value will your working directory `process.cwd()`.
	 * @param { context?: string, analyzer: ProjectAnalyzer<T>[], validations: IValidation[] }
	 */
	constructor({ context, analyzer, validations = [] }: ProjectValidatorOptions) {
		this.validations = validations;
		this.analyzer = analyzer;
		this.context = context || process.cwd();
	}

	/**
	 * Validates the project against certain validations and will return a list
	 * of required patches, which can be passed to the `ProjectPatcher.apply()` method.
	 */
	public async validate(): Promise<string[]> {
		// TODO: apply validators to the current project and save required patches
		try {
			this.validation = await this.runValidations();

			return this.validation.map((validationException): string => validationException.patch!).filter(Boolean);
		} catch (err) {
			// do nothing at the moment ...
			return [];
		}
	}

	/**
	 * Run all validations and collect their results
	 * @async
	 * @return Promise<ValidationException[]>
	 */
	private async runValidations(): Promise<ValidationException[]> {
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
