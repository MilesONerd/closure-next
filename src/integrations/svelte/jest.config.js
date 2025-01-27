/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/__tests__'],
  extensionsToTreatAsEsm: ['.svelte', '.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@closure-next/core$': '<rootDir>/../../../packages/core/src',
    '^svelte$': '<rootDir>/__mocks__/svelte.ts',
    '^svelte/internal$': '<rootDir>/__mocks__/svelte.ts'
  },
  transform: {
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true
      }
    ],
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        useESM: true
      }
    ],
    '^.+\\.js$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }]
        ]
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'svelte'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(svelte|@testing-library|@sveltejs)/.*)'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  verbose: true,
  testTimeout: 10000,
  maxWorkers: 1
};
