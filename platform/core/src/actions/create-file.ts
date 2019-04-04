import { writeFile } from 'fs';
import { IRawFileSystemCreateAction } from './abstract';

/**
 * Create a new file with certain contents
 * @param {string} targetSourcePath path to the main file
 * @param {string} contents path to the file to merge
 * @author jbiasi
 */
export async function createFile(targetSourcePath: string, contents: string): Promise<IRawFileSystemCreateAction> {
	try {
		return await new Promise<IRawFileSystemCreateAction>((resolve) => {
			return resolve({
				target: targetSourcePath,
				content: contents,
				exec() {
					return new Promise<boolean>((resolve) => {
						writeFile(targetSourcePath, contents, (err) => {
							resolve(err ? false : true);
						});
					});
				},
			});
		});
	} catch (err) {
		throw err;
	}
}
