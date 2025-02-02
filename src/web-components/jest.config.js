/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../packages/core/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
    '^(\\.{1,2}/.*)\\.tsx?$': '$1'
  },
  transform: {
    '^.+\\.(ts|tsx|mjs|js)$': ['babel-jest', {
      presets: ['@babel/preset-env', '@babel/preset-typescript'],
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', { allowTopLevelThis: true }]
      ]
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|dom-accessibility-api|@jest|@babel)/.*)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'mjs', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1,
  resolver: 'jest-ts-webcompat-resolver'
};
