import * as runAll from 'npm-run-all';
import { IShellAction } from './abstract';

/**
 * Execute a list of NPM tasks, returns an action type
 * @param {string[]} tasks tasks to execute
 * @author jbiasi
 */
export async function runNPMTasks(...tasks: string[]): Promise<IShellAction> {
	return new Promise<IShellAction>((resolve) => {
		resolve({
			commands: tasks,
			exec() {
				return new Promise<boolean>(async (resolve) => {
					const results: Array<{ code: number }> = await runAll(tasks, {
						parallel: false,
						continueOnError: false,
					});

					resolve(results.every((r) => r.code === 0));
				});
			},
		});
	});
}
