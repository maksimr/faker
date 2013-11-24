module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'expect', 'sinon'],
        files: [
            'src/**/*.js',
            'test/unit/mocha-globals.js',
            'test/unit/**/*.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: false
    });
};
