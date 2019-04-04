import { IAction } from './abstract';

export async function runActions(...actions: IAction<any>[]): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        resolve(true);
    });
};

export { createFile } from './create-file';
export { mergeFiles } from './merge-files';
export { mergeJSON } from './merge-json';
export { runNPMTasks } from './run-npm-tasks';