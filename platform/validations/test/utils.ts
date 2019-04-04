import { join } from 'path';
import { lookup } from 'dns';
import latestVersion = require('latest-version');

export function checkInternetConnection(): Promise<boolean> {
	return new Promise((resolve) => {
		lookup('google.com', (err: NodeJS.ErrnoException) => {
			if (err && err.code == 'ENOTFOUND') {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}

export function getFixtureDir(fixture: string): string {
	return join(__dirname, `../node_modules/@namics/frontend-defaults-platform-test-fixtures/`, fixture);
}

export async function getLatestVersion(dep: string, lts: boolean = false) {
	return await latestVersion(
		dep,
		lts
			? {
					version: 'lts',
			  }
			: undefined
	);
}
