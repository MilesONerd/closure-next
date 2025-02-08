export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.svelte$': ['svelte-jester', {
      preprocess: true
    }],
    '^.+\\.(ts|tsx|js|jsx|mjs)$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../../packages/core/src/index.ts',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.svelte'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testTimeout: 10000,
  verbose: true,
  transformIgnorePatterns: [
    'node_modules/(?!(svelte|@testing-library|@babel|@jest)/)'
  ],
  moduleFileExtensions: ['js', 'ts', 'tsx', 'svelte']
};
