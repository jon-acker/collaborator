module.exports = function(grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        jasmine : {
            src : ['src/**/*.js'],
            options : {
                keepRunner: true,
                specs : 'spec/**/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfigFile: 'collaborator/collaborator-requirejs-config.js',
                    requireConfig: { }
                }
            }
        }
    });

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-spec');
};