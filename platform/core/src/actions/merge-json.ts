import { writeFile } from 'fs';
import { getJSON } from '../utils/fs';

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