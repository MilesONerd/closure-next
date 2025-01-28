/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../packages/core/src'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.test.json',
      useESM: false,
      diagnostics: {
        warnOnly: true
      }
    }]
  },
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      diagnostics: false
    }
  },
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1
};
