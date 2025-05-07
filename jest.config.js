module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/tests'],
    testMatch: [
      '**/?(*.)+(spec|test).ts?(x)'
    ],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/']
  };
