import { Patch, PatchResult } from '@namics/frontend-defaults-platform-core';

export type TypeScriptUpdatePatchOptions = {
    latest: string,
    current: string
}

export class TypeScriptUpdatePatch extends Patch<TypeScriptUpdatePatchOptions> {
    public id = 'ts-update';

    async patch(opts: TypeScriptUpdatePatchOptions): Promise<PatchResult[]> {
        return [];
    }

    async dry(opts: TypeScriptUpdatePatchOptions): Promise<PatchResult[]> {
        return [];
    }
}