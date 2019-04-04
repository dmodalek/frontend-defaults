import { fileExists, getFileContents } from '@namics/frontend-defaults-platform-core';

type NPMRCPatchArguments = {
	create?: boolean;
};

export const npmrcPatch = async (cwd: string, args?: NPMRCPatchArguments): Promise<any> => {
	let currentFileContents = '';

	if (await fileExists(this.npmrcPath)) {
		currentFileContents = await getFileContents(this.npmrcPath);
	}

	return {
		id: 'NPMRCPatch',
		actions: [
			// TODO: define actions
		],
	};
};
