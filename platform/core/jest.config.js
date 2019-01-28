module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['<rootDir>/tests/__snapshots__/', '<rootDir>/dist'],
	watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/__tests__', '<rootDir>/dist'],
};
