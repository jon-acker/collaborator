'use strict';

module.exports = function(grunt) {

	grunt.config('grunt-spec-config', 'node_modules/grunt-spec/collaborator/collaborator-requirejs-config.js');

	grunt.initConfig({
		jasmine : {
			src : [],
			options : {
				keepRunner: true,
				specs : 'spec/**/*.js',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfigFile: grunt.config('grunt-spec-config'),
					requireConfig: { }
				}
			}
		}
	});

	var chalk = require('chalk');
	var readline = require('readline-sync');
	var readYaml = require('read-yaml');
	var jsYaml = require('js-yaml');

	/**
	 *
	 * @param specFilename
	 * @param specName
	 * @param moduleName
	 * @param capitalizedNamespaceParts
	 */
	function writeModuleSpec(specFilename, specName, moduleName, capitalizedNamespaceParts) {
		var moduleNameUC = capitalizedNamespaceParts[capitalizedNamespaceParts.length-1];
		grunt.file.write(specFilename,
			"define(['spec-module!" + specName + "'], function(" + moduleName + ") {\n" +
				"\n" +
				"    describe('" + capitalizedNamespaceParts.join(' ') + "', function() {\n" +
				"\n" +
				"        it('is an instance of " + moduleNameUC + "', function() {\n" +
				"            expect(" + moduleName + ".constructor.name).toBe('"+moduleNameUC+"');\n" +
				"        });\n" +
				"\n" +
				"    });\n" +
				"\n" +
				"});\n"
		);
	}

	/**
	 *
	 * @param specFilename
	 * @param specName
	 * @param moduleName
	 * @param namespaceParts
	 */
	function writeObjectSpec(specFilename, specName, moduleName, namespaceParts) {
		grunt.file.write(specFilename,
			"define(['spec-object!" + specName + "'], function(" + moduleName + ") {\n" +
				"\n" +
				"    describe('" + namespaceParts.join(' ') + "', function() {\n" +
				"\n" +
				"        it('is an instance of object', function() {\n" +
				"            expect(typeof " + moduleName + ").toBe('object');\n" +
				"        });\n" +
				"\n" +
				"    });\n" +
				"\n" +
				"});\n"
		);
	}

	/**
	 * Create collaborators js from yaml file
	 *
	 * @param collaborators
	 */
	function writeCollaborators(collaborators) {
		var formattedCollaborators = '';
		collaborators = collaborators || {};
		Object.keys(collaborators).forEach(function(collaborator, index) {
			formattedCollaborators += "    '" + collaborator + "': [" + collaborators[collaborator].map(function(c) { return "'"+c+"'"}) + "]";
			formattedCollaborators += index < Object.keys(collaborators).length -1 ? ",\n" : "";
		});

		grunt.file.write('collaborator/collaborators.js', "define({\n" + formattedCollaborators + "\n});\n");
	}

	grunt.event.on('jasmine.specDone', function(event) {
		var matches;
		if (event.status === 'failed' && (matches = event.failedExpectations[0].message.match(/is not a function \(evaluating \'(\w+)\.(\w+)\(\)/))) {
			grunt.log.writeln(chalk.red.bold('\n\nYour '+ chalk.green(matches[1]) +  ' doesn\'t seem to have a method called '+ chalk.green(matches[2]) + '.\n'));
			process.exit();
		}
	});

	grunt.event.once('error.onError', function(event) {
		if (typeof event === 'string') {

			event = JSON.parse(event);

			switch (event.error) {
				case 'E_NOENT_COLLABORATOR':
					event.file = event.file.replace('double/', '');
					grunt.log.writeln(chalk.white.bold.bgRed('Non existent module or collaborator: "' + event.file+'"\n'));

					var answer = readline.question([
						chalk.white.bgBlue('Would you like me to set up a collaborator/spy?'),
						"[Y/n]\n"
					]);

					if ((answer.toUpperCase() === 'Y')) {
						var collaborators = grunt.file.readYAML('collaborators.yml');
						collaborators = collaborators || {};
						collaborators[event.file] = ['method'];
						grunt.file.write('collaborators.yml', jsYaml.safeDump(collaborators, {flowLevel: 1}));
						grunt.log.writeln(chalk.blue('Collaborator interface  '+event.file+' created. Run grunt:run again'))
					}
					break;

				case 'E_NOENT_MODULE':
					grunt.log.writeln(chalk.bold.red('Module not found: ') + chalk.bold.grey(event.file));
					grunt.log.writeln(chalk.bold.red('Creating new module in file ') + chalk.bold.grey(event.file));
					grunt.log.writeln('---');

					var moduleName = event.file.split('\/').pop();
					var moduleNameUC = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

					grunt.file.write(event.file + '.js',
						"define(function() {\n" +
						"\n" +
						"    function " + moduleNameUC + "() {\n" +
						"\n" +
						"        //@todo: create methods here\n" +
						"\n" +
						"    }\n" +
						"\n" +
						"    return new " + moduleNameUC + "();\n" +
						"});\n"
					);
					break;

				case 'E_NOENT_OBJECT':
					grunt.log.writeln(chalk.bold.red('Object not found: ') + chalk.bold.grey(event.file));
					grunt.log.writeln(chalk.bold.red('Creating new AMD object file ') + chalk.bold.grey(event.file));
					grunt.log.writeln('---');

					grunt.file.write('src/' + event.file + '.js',
						"define(function() {\n" +
							"\n" +
							"    return {\n" +
							"\n" +
							"        //@todo: create methods here\n" +
							"\n" +
							"    }\n" +
							"\n" +
							"});\n"
					);
					break;
			}

			process.exit(0);

		}
	});

	grunt.registerTask('spec', 'Spec objects with Jasmine', function(command, specName) {

		switch (command) {
			// run jasmine tests
			case 'run':
				if (!grunt.file.exists('collaborators.yml')) {
					grunt.file.write('collaborators.yml');
				}

				writeCollaborators(grunt.file.readYAML('collaborators.yml'));

				grunt.task.run('jasmine');
				break;

			case 'module':
				var specFilename = 'spec/' + specName + '.js';
				var namespaceParts = specName.split('/');
				var moduleName = namespaceParts[namespaceParts.length - 1];
				var capitalizedNamespaceParts = namespaceParts.map(function(part) {
					return part.charAt(0).toUpperCase() + part.slice(1);
				});

				if (grunt.file.exists(specFilename)) {

					var answer = readline.question([
						chalk.white.bgBlue('The file '+specFilename+' already exists, would you like to overwrite it?'),
						'[y/N]'
					]);

					(answer.toUpperCase() === 'Y') && grunt.file.delete(specFilename);
				}

				if (typeof answer === 'undefined' || answer.toUpperCase() === 'Y') {
					grunt.log.writeln(chalk.white.bgBlue('Creating module spec in: ' + specFilename));
					writeModuleSpec(specFilename, specName, moduleName, capitalizedNamespaceParts);
				}
				break;


			case 'object':
				var specFilename = 'spec/' + specName + '.js';
				var namespaceParts = specName.split('/');
				var moduleName = namespaceParts[namespaceParts.length - 1];

				if (grunt.file.exists(specFilename)) {

					var answer = readline.question([
						chalk.white.bgBlue('The file '+specFilename+' already exists, would you like to overwrite it?'),
						'[y/N]'
					]);

					(answer.toUpperCase() === 'Y') && grunt.file.delete(specFilename);
				}

				if (typeof answer === 'undefined' || answer.toUpperCase() === 'Y') {
					grunt.log.writeln(chalk.white.bgBlue('Creating object in: ' + specFilename));
					writeObjectSpec(specFilename, specName, moduleName, namespaceParts);
				}
				break;
		}


	});



};


