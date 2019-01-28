import { readFile, writeFile, access } from 'fs';
import { F_OK } from 'constants';
import globby from 'globby';

export async function getFileContents(path: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		readFile(path, (error, data) => {
			if (error) {
				return reject(error);
			}

			resolve(data.toString());
		});
	});
}

export async function getJSON<Result>(path: string): Promise<Result> {
	try {
		const contents = await getFileContents(path);
		const result: Result = JSON.parse(contents);
		return result;
	} catch (err) {
		return err;
	}
}

type MergeJSONResult<Result> = {
	base: Partial<Result>;
	overrides: Partial<Result>;
	merged: Result;
};

export async function mergeJSON<Result extends Object>(
	baseSource: string,
	mergableSource: string
): Promise<MergeJSONResult<Result>> {
	try {
		const baseContents = await getJSON<Partial<Result>>(baseSource);
		const mergableContents = await getJSON<Partial<Result>>(mergableSource);
		const rawObjectMerge = Object.assign(<Result>{}, baseContents, mergableContents);
		const writableMerge = Buffer.from(JSON.stringify(rawObjectMerge));

		return await new Promise<MergeJSONResult<Result>>((resolve, reject) => {
			writeFile(baseSource, writableMerge, (err) => {
				err
					? reject(err)
					: resolve({
						merged: rawObjectMerge,
						base: baseContents,
						overrides: mergableContents,
					});
			});
		});
	} catch (err) {
		return err;
	}
}

export async function fileExists(path: string): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		access(path, F_OK, (err) => (err ? resolve(false) : resolve(true)));
	});
}

export async function findFilesByPattern(cwd: string = process.cwd(), pattern: string | string[]): Promise<string[]> {
	return await globby(pattern, { cwd });
}
