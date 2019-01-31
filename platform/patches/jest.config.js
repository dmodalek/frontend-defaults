module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['<rootDir>/test/__snapshots__/'],
	watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist'],
	globals: {
		"ts-jest": {
			tsConfig: 'tsconfig.test.json'
		}
	}
};
