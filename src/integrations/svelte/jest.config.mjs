/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../../packages/core/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.svelte$': '$1'
  },
  transform: {
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
    '^.+\\.(ts|tsx|js|jsx|mjs)$': ['ts-jest', {
      useESM: true,
      tsconfig: './tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|dom-accessibility-api|@jest|@babel|@closure-next|svelte)/.*)'
  ],
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true
    }
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.svelte'],
  moduleDirectories: ['node_modules', '<rootDir>/../../../node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'svelte', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1,
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.mjs'
  ]
};

export default config;
