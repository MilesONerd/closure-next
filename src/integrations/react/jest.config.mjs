/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        useESM: true
      }
    ]
  },
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../../packages/core/src/index.ts'
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.polyfills.mjs',
    '<rootDir>/jest.setup.mjs',
    '@testing-library/jest-dom'
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
  testTimeout: 10000,
  transformIgnorePatterns: ['node_modules/(?!(@testing-library|@babel|@jest))'],
  verbose: true,
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts', '.mtsx'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
}
