/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/__tests__'],
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../../packages/core/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
    '^(\\.{1,2}/.*)\\.tsx?$': '$1'
  },
  transform: {
    '^.+\\.(ts|tsx|mjs|js)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-typescript', { 
          allowDeclareFields: true,
          onlyRemoveTypeImports: true
        }]
      ],
      plugins: [
        ['@babel/plugin-transform-modules-commonjs', { allowTopLevelThis: true }],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }]
      ]
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|dom-accessibility-api|@jest|@babel|@angular|tslib|rxjs)/.*)'
  ],
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'mjs', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1,
  resolver: 'jest-ts-webcompat-resolver'
};
