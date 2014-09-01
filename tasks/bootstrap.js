var grunt = require('grunt');

module.exports.configure = function(moduleRoot) {

	grunt.config('grunt-spec-config', moduleRoot + 'collaborator-requirejs-config.js');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.initConfig({
		jasmine : {
			src : [],
			options : {
				keepRunner: true,
				specs : 'spec/**/*.js',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfigFile: grunt.config('grunt-spec-config'),
					requireConfig: {
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
		}
	});
}

