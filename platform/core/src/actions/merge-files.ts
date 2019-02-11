import { getFileContents } from '../utils/fs';
import { appendFile } from 'fs';

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
