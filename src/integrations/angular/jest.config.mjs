/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/__tests__'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        isolatedModules: true,
        stringifyContentPathRegex: '\\.html$',
        diagnostics: { warnOnly: true },
        useESM: true
      }
    ]
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/node_modules',
    '<rootDir>/../../node_modules',
    '<rootDir>/../../../node_modules'
  ],
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../../packages/core/src'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  testTimeout: 10000,
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|tslib|rxjs))'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  verbose: true,
  maxWorkers: 1,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)']
};
