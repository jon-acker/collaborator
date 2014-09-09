'use strict';

var grunt = require('grunt');

module.exports.configure = function(moduleRoot) {

	grunt.config('grunt-spec-config', moduleRoot + 'collaborator-requirejs-config.js');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	var config = grunt.config();
	var srcDir = config.gruntSpec && config.gruntSpec.src ? config.gruntSpec.src : 'src/';
	var specDir = config.gruntSpec && config.gruntSpec.spec ? config.gruntSpec.spec : 'spec/';

	config.gruntSpec = {
		src: srcDir,
		spec: specDir
	};

	config.jasmine = {
		options : {
			keepRunner: true,
			specs : specDir + '**/*.js',
			template: require('grunt-template-jasmine-requirejs'),
			templateOptions: {
				requireConfigFile: grunt.config('grunt-spec-config'),
				requireConfig: {
					specDirSrc: srcDir,
					specDirSpec: specDir,
					paths: {
						collaborator: moduleRoot + 'collaborator',
						'spec-object': moduleRoot + 'spec-object',
						'spec-module': moduleRoot + 'spec-module',
						'collaborator/definer': moduleRoot + 'definer',
						'collaborators': moduleRoot + 'collaborators',
						'collaborator/builder': moduleRoot + 'builder'
					}
				}
			}
		}
	};

	config.jasmine[srcDir] = [];

	grunt.initConfig(config);
};

