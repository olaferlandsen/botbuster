export default {
    testEnvironment: 'jest-environment-jsdom',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            useESM: true,
            tsconfig: './tsconfig.json'
        }]
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1'
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    testMatch: ['**/*.test.ts']
};
