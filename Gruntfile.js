/*global module:false*/
module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    var util = require('util');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        files: {
            config: ['Gruntfile.js'],
            source: ['src/faker.js', 'src/**/*.js'],
            test: ['test/unit/**/*.js'],
            all: [
                '<%= files.config %>',
                '<%= files.source %>',
                '<%= files.test %>'
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
                files: '<%= files.all %>'
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['<%= files.source %>'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            },
            unit: {
                singleRun: true
            }
        },
        watch: {
            all: {
                files: '<%= files.all %>',
                tasks: ['jshint', 'karma:unit']
            }
        }
    });

    grunt.registerTask('release', 'Bump the version and publish to NPM.', function(type) {
        grunt.task.run([
            'npm-contributors',
            util.format('bump:%s', type || 'patch'),
            'npm-publish'
        ]);
    });
    grunt.registerTask('ci', ['default', 'npm-contributors', 'bump']);
    grunt.registerTask('test', ['jshint', 'karma:unit']);
    grunt.registerTask('default', ['test', 'concat', 'uglify']);
};
