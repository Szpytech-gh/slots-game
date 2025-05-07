module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/tests/unit'], // to only include unit tests
    testMatch: [
      '**/?(*.)+(spec).ts?(x)'
    ],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
  };
