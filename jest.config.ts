// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: 'src',
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.ts$': [
            'ts-jest',
            {
                tsconfig: './tsconfig.json'
            },
        ],
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
    testPathIgnorePatterns: ['/node_modules/', '/test/'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/$1',
        '^@user/(.*)$': '<rootDir>/user/$1', // si usas @user/... en imports
    },
    verbose: true,
};

export default config;