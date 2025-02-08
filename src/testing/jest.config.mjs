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
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.mjs',
    '<rootDir>/__tests__/setup.ts'
  ],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(@closure-next)/)'
  ],
  moduleDirectories: ['node_modules'],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        allowJs: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler'
      }
    }
  },
  verbose: true
};
