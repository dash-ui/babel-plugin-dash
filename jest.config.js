const path = require('path')

module.exports = {
  // testEnvironment: 'jest-environment-jsdom',
  moduleDirectories: ['node_modules', path.join(__dirname, 'test')],
  testPathIgnorePatterns: ['node_modules', '__fixtures__'],
  moduleNameMapper: {
    'test-utils': path.join(__dirname, 'test/utils.js'),
  },
  setupFilesAfterEnv: [require.resolve('./test/setup.js')],
  snapshotResolver: require.resolve('./test/resolve-snapshot.js'),
  collectCoverageFrom: ['**/src/**/*.js', '!**/__fixtures__/*'],
  // coverageThreshold: {
  //   global: {
  //     statements:17,
  //     branches: 4,
  //     lines: 17,
  //     functions: 20
  //   }
  // },
  globals: {
    __DEV__: true,
  },
}
