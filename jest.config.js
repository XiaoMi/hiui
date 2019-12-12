module.exports = {
  // Stop running tests after the first failure
  bail: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/test/coverage',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json-summary',
    'text',
    'lcov'
  ],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: [
  //   '<rootDir>/components/**/*',
  //   '!<rootDir>/components/(alert|badge|button)/index.js',
  //   '!<rootDir>/components/**/style/**/*',
  //   '!<rootDir>/components/**/__test__/**/*',
  //   '!<rootDir>/components/**/(*-legacy)/**/*'
  // ],
  // 本地单测使用
  // 1. 修改范围 <rootDir>/components/[组件名称]/**/*
  // 2. 运行单测命令 npx jest components/[组件名称]/__tests__/index.test.js --coverage 即可看到当前文件夹的覆盖率
  collectCoverageFrom: [
    '<rootDir>/components/tabs/**/*',
    // '<rootDir>/components/**/*',
    '!<rootDir>/components/**/style/**/*',
    '!<rootDir>/components/**/__test__/**/*',
    '!<rootDir>/components/**/(*-legacy)/**/*'
  ],

  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom-global',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [
    '<rootDir>/jest.setup.js'
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx' ],

  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/stylesMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/fileMock.js'
  },

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/output/',
    '__mocks__',
    'dekko',
    'node'
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest'
  },

  // The regexp pattern Jest uses to detect test files
  testRegex: '(.*/__tests__/.*(\\.|/)(test|spec))\\.[jt]sx?$',

  transformIgnorePatterns: [
    '/output/',
    'node_modules/[^/]+?/(?!(es|node_modules)/)'
  ],
  verbose: true,
  testURL: 'http://localhost/'
}
