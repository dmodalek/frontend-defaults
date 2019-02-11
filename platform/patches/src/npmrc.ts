import {
    fileExists,
    getFileContents,
    Patch,
    PatchResult
    } from '@namics/frontend-defaults-platform-core';

type SinglePatchConfiguration = {
    id: string,
    actions: Array<() => any>
}

type PatchConfiguration = SinglePatchConfiguration | SinglePatchConfiguration[];

type NPMRCPatchArguments = {
    create?: boolean
}

export const npmrcPatch = async (cwd: string, args?: NPMRCPatchArguments): Promise<PatchConfiguration> => {
    let currentFileContents = '';

    if (await fileExists(this.npmrcPath)) {
        currentFileContents = await getFileContents(this.npmrcPath);
    }

    return {
        id: 'NPMRCPatch',
        actions: [
            // TODO: define actions
        ]
    }
}

export class NPMRCPatch extends Patch<void> {
    public id = 'npmrc';

    async patch(): Promise<PatchResult[]> {
        return [];
    }

    async dry(): Promise<PatchResult[]> {
        return [];
    }

    private async getExistingContent(): Promise<string> {
        if (await fileExists(this.npmrcPath)) {
            return await getFileContents(this.npmrcPath);
        }

        return '';
    }

    private get npmrcPath(): string {
        return this.context.getPath('.npmrc');
    }
}