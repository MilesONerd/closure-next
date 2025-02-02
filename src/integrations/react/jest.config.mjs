export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../packages/core/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^(\\.{1,2}/.*)\\.mjs$': '$1',
    '^(\\.{1,2}/.*)\\.tsx?$': '$1',
    '^@testing-library/jest-dom$': '@testing-library/jest-dom'
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.json'
    }],
    '^.+\\.(mjs|js)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }]
      ]
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|dom-accessibility-api|@jest|@babel|react|react-dom|aria-query|jest-dom)/.*)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'mjs', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/*.[jt]s?(x)', '!**/__tests__/TestComponent.tsx'],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1,
  resolver: 'jest-ts-webcompat-resolver'
}
