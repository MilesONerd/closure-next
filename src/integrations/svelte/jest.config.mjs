const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../../packages/core/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
    '^(\\.{1,2}/.*)\\.svelte$': ['svelte-jester', { preprocess: true }]
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': ['ts-jest', {
      useESM: true,
      tsconfig: './tsconfig.json'
    }],
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
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
  moduleFileExtensions: ['ts', 'tsx', 'mjs', 'js', 'svelte', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1,
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.mjs'
  ]
};

export default config;
