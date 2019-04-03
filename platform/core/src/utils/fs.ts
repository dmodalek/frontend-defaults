import { F_OK } from 'constants';
import {
	access,
	appendFile,
	readFile,
	writeFile,
	stat
} from 'fs';
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
		throw err;
	}
}

type MergeFilesResult = {
	base: string;
	overrides: string;
	merged: string;
};

/**
 * Merge any two files into the base and returns information about the merge
 * @param baseSourcePath path to the main file
 * @param mergableSourcePath path to the file to merge
 * @param dry if this should be a dry run
 */
export async function mergeFiles(
	baseSourcePath: string,
	mergableSourcePath: string,
	dry: boolean = false
): Promise<MergeFilesResult> {
	try {
		const baseContents = await getFileContents(baseSourcePath);
		const mergableContents = await getFileContents(mergableSourcePath);
		const theoreticalMerge = [baseContents, mergableContents].join('\n');

		return await new Promise<MergeFilesResult>((resolve, reject) => {
			if (dry) {
				// return theoretical merge content
				return resolve({
					merged: theoreticalMerge,
					base: baseContents,
					overrides: mergableContents,
				});
			}

			appendFile(baseSourcePath, mergableContents, (err) => {
				err
					? reject(err)
					: resolve({
						merged: theoreticalMerge,
						base: baseContents,
						overrides: mergableContents,
					});
			});
		});
	} catch (err) {
		throw err;
	}
}

type MergeJSONResult<Result> = {
	base: Partial<Result>;
	overrides: Partial<Result>;
	merged: Result;
};

/**
 * Merge two JSON files into the base JSON and returns information about the merge
 * @param baseSourcePath path to the main JSON file
 * @param mergableSourcePath path to the JSON file to merge
 * @param dry if this should be a dry run
 */
export async function mergeJSON<Result extends Object>(
	baseSourcePath: string,
	mergableSourcePath: string,
	dry: boolean = false
): Promise<MergeJSONResult<Result>> {
	try {
		const baseContents = await getJSON<Partial<Result>>(baseSourcePath);
		const mergableContents = await getJSON<Partial<Result>>(mergableSourcePath);
		const rawObjectMerge = Object.assign(<Result>{}, baseContents, mergableContents);
		const writableMerge = Buffer.from(JSON.stringify(rawObjectMerge));

		return await new Promise<MergeJSONResult<Result>>((resolve, reject) => {
			if (dry) {
				// return theoretical merge content
				return resolve({
					merged: rawObjectMerge,
					base: baseContents,
					overrides: mergableContents,
				});
			}

			writeFile(baseSourcePath, writableMerge, (err) => {
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
		throw err;
	}
}

export async function fileExists(path: string): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		access(path, F_OK, (err) => (err ? resolve(false) : resolve(true)));
	});
}

export async function directoryExists(path: string): Promise<boolean> {
	return new Promise<boolean>((resolve) => {
		access(path, (err) => {
			resolve((err && err.code === 'ENOENT') ? false : true)
		});
	})
}

export async function findFilesByPattern(cwd: string = process.cwd(), pattern: string | string[]): Promise<string[]> {
	return await globby(pattern, { cwd });
}

export const displayPath = (selectedPath: string) => selectedPath.replace(process.cwd(), '');