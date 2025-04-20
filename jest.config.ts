module.exports = {
    preset: 'ts-jest/presets/default',
    testEnvironment: 'node',
    rootDir: 'src',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
        }],
    },
    collectCoverageFrom: [
        '**/*.(t|j)s',
        '!main.ts',
        '!**/app.module.ts',
        '!**/graphql.schema.ts',
        '!**/*.d.ts',
    ],
    coverageDirectory: '../coverage',
    coverageReporters: ['text', 'lcov'],
    coveragePathIgnorePatterns: [
        '<rootDir>/main.ts',
        '\\.module\\.ts$',
        '\\.entity\\.ts$',
        '<rootDir>/graphql.schema.ts',
    ],
};
