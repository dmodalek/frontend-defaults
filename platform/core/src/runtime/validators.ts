import { ValidationResult } from '../validations';

type Validator<A> = (cwd: string, analytics: A) => Promise<ValidationResult[]>

function runValidators<V1>(cwd: string, v1: Validator<V1>): ValidationResult[]
function runValidators(cwd: string, analytics: any, ...validators: Validator<any>[]): ValidationResult[] {
	if (!validators || validators.length === 0) {
		return [] as any;
	}

	return validators.reduce(
		async (prev: any, curr: Validator<any>) => ([
			...(await prev),
			...(await curr(cwd, analytics)),
		]),
		Promise.resolve([] as any)
	);
}

export { runValidators };