import { getFileContents } from '../utils/fs';
import { appendFile } from 'fs';
import { IRawFileSystemChangeAction } from './abstract';

/**
 * Merge any two files into the base and returns information about the merge
 * @param {string} baseSourcePath path to the main file
 * @param {string} mergableSourcePath path to the file to merge
 * @author jbiasi
 */
export async function mergeFiles(
    baseSourcePath: string,
    mergableSourcePath: string,
): Promise<IRawFileSystemChangeAction> {
    try {
        const baseContents = await getFileContents(baseSourcePath);
        const mergableContents = await getFileContents(mergableSourcePath);
        const theoreticalMerge = [baseContents, mergableContents].join('\n');

        return await new Promise<IRawFileSystemChangeAction>((resolve) => {
            return resolve({
                merged: theoreticalMerge,
                base: baseContents,
                overrides: mergableContents,
                exec() {
                    return new Promise<boolean>((resolve) => {
                        appendFile(baseSourcePath, theoreticalMerge, err => {
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
