/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../packages/core/dist/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx|mjs)$': ['ts-jest', {
      useESM: true,
      tsconfig: './tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@closure-next)/.*)'
  ],
  globals: {
    'ts-jest': {
      useESM: true,
      isolatedModules: true
    }
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleDirectories: ['node_modules', '<rootDir>/../../node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  verbose: true,
  testTimeout: 30000,
  maxWorkers: 1,
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.mjs'
  ]
};

export default config;
