module.exports = {
    browsers: ['chrome'],
    src: ['tests/e2e/**/*.ts'], // to only include E2E tests
    reporter: {
        name: 'spec',
    },
    screenshots: {
        takeOnFails: true,
        path: 'tests/screenshots/',
        fullPage: true
    },
    concurrency: 1,
    selectorTimeout: 5000,
    assertionTimeout: 7000,
    pageLoadTimeout: 10000,
    skipJsErrors: true,
    skipUncaughtErrors: true,
    clientScripts: [],
    tsConfigPath: 'tsconfig.json',
    baseUrl: 'http://localhost:9000'
};