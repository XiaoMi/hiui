const transformIgnorePatterns = [
  '/output/',
  'node_modules/[^/]+?/(?!(es|node_modules)/)'
]

module.exports = {
  // automock: true,
  // clearMocks: true,
  // verbose: false,
  // testEnvironment: 'jsdom',
  setupFiles: [ '<rootDir>/jest.setup.js' ],
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx' ],
  modulePathIgnorePatterns: [ '/_site/', '/output/' ],
  // unmockedModulePathPatterns: [
  //   'node_modules/react/',
  //   'node_modules/enzyme/'
  // ],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/stylesMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/test/fileMock.js'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/output/',
    '__mocks__',
    'dekko',
    'node'
  ],
  transform: {
    '^.+\\.(js|jsx|mjs)$': '<rootDir>/node_modules/babel-jest'
  },
  testRegex: '(.*/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  collectCoverage: false, // 是否收集测试时的覆盖率信息
  collectCoverageFrom: ['<rootDir>/components/**/*.{js,jsx,mjs}'], // 哪些文件需要收集覆盖率信息
  coverageDirectory: '<rootDir>/test/coverage',
  // setupTestFrameworkScriptFile: './node_modules/jest-enzyme/lib/index.js',
  transformIgnorePatterns
  // runner: 'jest-electron-runner',
  // testEnvironment: 'jest-environment-electron',
  //   snapshotSerializers: [
  //     'enzyme-to-json/serializer',
  //   ],

}
