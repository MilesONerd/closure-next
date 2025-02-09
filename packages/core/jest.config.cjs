/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json',
      useESM: false,
      isolatedModules: true
    }]
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable'
  },
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/src'
  },
  testMatch: ['**/__tests__/**/*.test.(ts|js)'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost',
    pretendToBeVisual: true,
    resources: 'usable',
    html: '<!DOCTYPE html><html><body></body></html>',
    customExportConditions: ['node', 'node-addons']
  },
  setupFiles: ['<rootDir>/jest.globals.cjs'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  injectGlobals: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: {
        warnOnly: true
      }
    }
  }
};
