/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true,
        isolatedModules: true,
        diagnostics: {
          warnOnly: true
        }
      }
    ]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/jest.polyfills.mjs'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@closure-next/core$': '<rootDir>/src'
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      useESM: true
    }
  },
  verbose: true,
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable',
    runScripts: 'dangerously',
    customExportConditions: ['node', 'node-addons']
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
}
