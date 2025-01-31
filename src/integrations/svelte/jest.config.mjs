/** @type {import('@jest/types').Config.InitialOptions} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jest-environment-jsdom',
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }]
  },
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../../packages/core/src/index.ts'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.svelte'],
  setupFilesAfterEnv: [
    '<rootDir>/jest.polyfills.mjs',
    '<rootDir>/jest.setup.mjs'
  ],
  testTimeout: 10000
}
