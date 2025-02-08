export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.json'
    }]
  },
  moduleNameMapper: {
    '^@closure-next/core$': '<rootDir>/../../packages/core/src/index.ts',
    '^@closure-next/core/(.*)$': '<rootDir>/../../packages/core/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '#app': '<rootDir>/node_modules/nuxt/dist/app/index.mjs',
    '#head': '<rootDir>/node_modules/nuxt/dist/head/runtime/index.mjs',
    '#imports': '<rootDir>/node_modules/nuxt/dist/app/composables/index.mjs',
    '#components': '<rootDir>/node_modules/nuxt/dist/app/components/index.mjs'
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.mts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
  testTimeout: 10000,
  verbose: true,
  transformIgnorePatterns: [
    'node_modules/(?!(nuxt|@nuxt|@vue|vue-demi|h3|ofetch|ufo|hookable|unctx|destr|unenv)/)'
  ]
};
