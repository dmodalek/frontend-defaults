import { writeFile } from 'fs';
import { getJSON } from '../utils/fs';
import { IJSONFileSystemAction } from './abstract';

/**
 * Merge two JSON files into the base JSON and returns information about the merge
 * @param {string} baseSourcePath path to the main JSON file
 * @param {string} mergableSourcePath path to the JSON file to merge
 * @author jbiasi
 */
export async function mergeJSON<Result extends Object>(
	baseSourcePath: string,
	mergableSourcePath: string,
): Promise<IJSONFileSystemAction<Result>> {
	try {
		const baseContents = await getJSON<Partial<Result>>(baseSourcePath);
		const mergableContents = await getJSON<Partial<Result>>(mergableSourcePath);
		const rawObjectMerge = Object.assign(<Result>{}, baseContents, mergableContents);
		const writableMerge = Buffer.from(JSON.stringify(rawObjectMerge));

		return await new Promise<IJSONFileSystemAction<Result>>((resolve, reject) => {
			return resolve({
				merged: rawObjectMerge,
				base: baseContents,
				overrides: mergableContents,
				exec() {
					return new Promise<boolean>((resolve) => {
						writeFile(baseSourcePath, writableMerge, (err) => {
							resolve(err ? false : true);
						});
					});
				}
			});
		});
	} catch (err) {
		throw err;
	}
}