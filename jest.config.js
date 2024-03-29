const resolve = require('path').resolve

module.exports = {
  globalSetup: resolve('./jest/globalSetup.js'),
  globalTeardown: resolve('./jest/globalTeardown.js'),
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
  roots: ['src', '__tests__'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '(/__tests__/.*|(\\.|/)(test|spec))\\.d.ts$',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: resolve('./tsconfig.test.json'),
      packageJson: resolve('./package.json'),
      diagnostics: true,
    },
  },
  testMatch: null,
}
