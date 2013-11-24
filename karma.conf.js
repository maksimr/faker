module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'expect', 'sinon'],
        files: [
            'src/faker.js',
            'src/**/*.js',
            'test/unit/mocha-global.js',
            'test/unit/**/*.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: false
    });
};
