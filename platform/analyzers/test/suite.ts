import path from 'path';

export const getFixturePath = (name: string): string => {
	return path.join(__dirname, `../node_modules/@namics/frontend-defaults-platform-test-fixtures/${name}`);
};
