import { join } from 'path';

export function getFixtureDir(fixture: string): string {
	return join(__dirname, `../node_modules/@namics/frontend-defaults-platform-test-fixtures/`, fixture);
}
