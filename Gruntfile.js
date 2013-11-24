/*global module:false*/
module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var util = require('util');

    grunt.initConfig({
        files: {
            config: ['Gruntfile.js'],
            source: ['js/**/*.js'],
            test: ['test/unit/**/*.js'],
            all: [
                '<%= options.files.config %>',
                '<%= options.files.source %>',
                '<%= options.files.test %>'
            ]
        },
        'npm-contributors': {
            options: {
                commitMessage: 'chore: update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'chore: release v%VERSION%',
                pushTo: 'origin'
            }
        },
        'auto-release': {
            options: {
                checkTravisBuild: true
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: {
                files: '<%= options.files.all %>'
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            },
            continuous: {
                background: true
            },
            unit: {
                singleRun: true
            }
        },
        watch: {
            all: {
                files: '<%= options.files.all %>',
                tasks: ['jshint', 'karma:continuous:run']
            }
        }
    });

    grunt.registerTask('release', 'Bump the version and publish to NPM.', function(type) {
        grunt.task.run([
            'npm-contributors',
            util.format("bump:%s", type || 'patch'),
            'npm-publish'
        ]);
    });
    grunt.registerTask('test', ['jshint', 'karma:unit']);
    grunt.registerTask('watch', ['karma:continuous', 'watch']);
    grunt.registerTask('default', ['test']);
};
