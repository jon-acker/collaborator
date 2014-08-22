'use strict';

module.exports = function(grunt) {
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

	var chalk = require('chalk');
	var readline = require('readline-sync');
	var readYaml = require('read-yaml');
	var jsYaml = require('js-yaml');

	function writeSpec(specFilename, specName, moduleName, capitalizedNamespaceParts) {
		var moduleNameUC = capitalizedNamespaceParts[capitalizedNamespaceParts.length-1];
		grunt.file.write(specFilename,
			"define(['spec!" + specName + "'], function(" + moduleName + ") {\n" +
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

	function writeCollaborators(collaborators) {
		var formattedCollaborators = '';
		collaborators = collaborators || {};
		Object.keys(collaborators).forEach(function(collaborator, index) {
			formattedCollaborators += "    '" + collaborator + "': [" + collaborators[collaborator].map(function(c) { return "'"+c+"'"}) + "]";
			formattedCollaborators += index < Object.keys(collaborators).length -1 ? ",\n" : "";
		});

		grunt.file.write('collaborator/collaborators.js', "define({\n" + formattedCollaborators + "\n});\n");
	}

	grunt.event.once('jasmine.specDone', function(event) {
		var matches;
		if (event.status === 'failed' && (matches = event.failedExpectations[0].message.match(/is not a function \(evaluating \'(\w+)\.(\w+\(\))/))) {
			grunt.log.writeln(chalk.red.bold('You don\'t seem to have a method called '+matches[2]+' in your '+matches[1]));
			process.exit();
		}
	});


	grunt.event.once('error.onError', function(event) {
		if (typeof event === 'string') {

			var matches
			if (matches = event.match(/Illegal path or script error: \[\'(.*)\'\]/)) {
				grunt.log.writeln(chalk.white.bold.bgRed('Non existent module or collaborator: "' + matches[1]+'"\n'));

				var answer = readline.question([
					chalk.white.bgBlue('Would you like me to set up a collaborator interface for "'+matches[1]+'" ?'),
					"[Y/n]\n"
				]);

				if ((answer.toUpperCase() === 'Y')) {
					var collaborators = grunt.file.readYAML('collaborators.yml');
					collaborators = collaborators || {};
					collaborators[matches[1]] = ['method'];
					grunt.file.write('collaborators.yml', jsYaml.safeDump(collaborators, {flowLevel: 1}));
					grunt.log.writeln(chalk.blue('Collaborator interface  '+matches[1]+' creates. Run grunt:run again'))
				}

				process.exit(0);
			}

			event = JSON.parse(event);

			if (event.error === 'E_NOENT') {

				grunt.log.writeln(chalk.bold.red('Module not found: ') + chalk.bold.grey(event.file));
				grunt.log.writeln(chalk.bold.red('Creating new module...file ') + chalk.bold.grey(event.file));
				grunt.log.writeln('---');

				var moduleName = event.file.split('\/').pop();
				var moduleNameUC = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

				grunt.file.write('src/' + event.file + '.js',
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

				process.exit(0);
			}
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

			// describe and/or create spec file
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
					grunt.log.writeln(chalk.white.bgRed('Creating spec in: ' + specFilename));
					writeSpec(specFilename, specName, moduleName, capitalizedNamespaceParts);
				}
				break;
		}


	});



};


