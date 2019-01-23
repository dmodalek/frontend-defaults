module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['<rootDir>/__tests__/__snapshots__/'],
	watchPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/__tests__',
		'<rootDir>/dist',
		'<rootDir>/tests/fixtures',
	],
};
