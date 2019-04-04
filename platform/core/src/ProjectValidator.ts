import { Constructable } from './types/Constructable';
import { IValidation, ValidationException, RequiredValidationPatch } from './Validation';
import { ProjectAnalyzer } from './ProjectAnalyzer';
import { IContext } from './Context';

type ProjectValidatorOptions = {
	validations?: Constructable<IValidation>[];
	analyzer: ProjectAnalyzer;
	context: IContext;
};

export interface IProjectValidator {
	context: IContext;
	validation: ValidationException[];
	validate(): Promise<RequiredValidationPatch[]>;
}

/**
 * Main class to handle validations inside a certain context.
 * Result can be used to apply certain patches with the `ProjectPatcher`.
 * @class
 * @implements {IProjectValidator}
 * @author Jan Biasi <jan.biasi@namics.com>
 */
export class ProjectValidator implements IProjectValidator {
	public context: IContext;
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
		this.context = context;
	}

	/**
	 * Validates the project against certain validations and will return a list
	 * of required patches, which can be passed to the `ProjectPatcher.apply()` method.
	 */
	public async validate(): Promise<RequiredValidationPatch[]> {
		// TODO: apply validators to the current project and save required patches
		try {
			this.validation = await this.runValidations();

			return Array.from(this.validation).reduce(
				(prev: RequiredValidationPatch[], curr: ValidationException): RequiredValidationPatch[] => {
					return [...prev, ...(curr.patches || [])];
				},
				[] as RequiredValidationPatch[]
			);
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
