/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
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
        diagnostics: { warnOnly: true }
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
  setupFilesAfterEnv: ['<rootDir>/test-app/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  testTimeout: 10000,
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true
    }
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@angular|tslib|rxjs))'
  ],
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
