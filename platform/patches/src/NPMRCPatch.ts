import {
    fileExists,
    getFileContents,
    Patch,
    PatchResult
    } from '@namics/frontend-defaults-platform-core';

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