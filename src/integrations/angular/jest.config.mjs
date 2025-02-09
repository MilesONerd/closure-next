export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../packages/core/src',
    '^@closure-next/core/(.*)$': '<rootDir>/../../packages/core/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.test.json'
    }]
  }
};
