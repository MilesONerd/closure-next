export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@closure-next/core$': '<rootDir>/../../packages/core/src/index.ts',
    '^@closure-next/core/(.*)$': '<rootDir>/../../packages/core/src/$1'
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.json'
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@closure-next)/)'
  ],
  moduleDirectories: ['node_modules'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  verbose: true
};
