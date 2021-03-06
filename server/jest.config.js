module.exports = {
  setupFiles: ['dotenv/config'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  testPathIgnorePatterns: ['dist'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputName: 'junit-TEST.xml',
      },
    ],
  ],
  collectCoverageFrom: ['src/resolvers/**/*.{js,jsx,ts,tsx}', '!src/resolvers/index.ts', '!src/resolvers/mutation.ts'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 50,
    },
  },
}
