/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      useESM: true
    }]
  },
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../core/src/index.ts'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@closure-next)/)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};
