'use strict';

module.exports = function(grunt) {

	var chalk = require('chalk');
	var readline = require('readline-sync');
	var jsYaml = require('js-yaml');

	var specWriter = require('./writer/spec');
	var srcWriter = require('./writer/src');
	var collaboratorWriter = require('./writer/collaborator');
	var bootstrap = require('./bootstrap');

	var packageJsonPath = process.cwd() + '/package.json';
	var moduleName = 'grunt-spec';
	var moduleRoot = 'node_modules/' + moduleName + '/collaborator/';

	if (grunt.file.exists(packageJsonPath) && require(packageJsonPath).name === moduleName) {
		moduleRoot = 'collaborator/';
	}

	bootstrap.configure(moduleRoot);

	grunt.event.on('jasmine.specDone', function(event) {
		var matches;

		if (event.status === 'failed' && (matches = event.failedExpectations[0].message.match(/is not a function \(evaluating \'(\w+)\.(\w+)\(.*\)/))) {
			grunt.log.writeln(chalk.red.bold('\n\nYour '+ chalk.green(matches[1]) +  ' doesn\'t seem to have a method called '+ chalk.green(matches[2]) + '.\n'));
			process.exit();
		}
	});

	grunt.event.once('error.onError', function(event) {
		if (typeof event === 'string') {
			var answer = '';
			event = JSON.parse(event);

			switch (event.error) {
				case 'E_NOENT_COLLABORATOR':
					event.file = event.file.replace('double/', '');
					grunt.log.writeln(chalk.white.bold.bgRed('Non existent module or collaborator: "' + event.file+'"\n'));

					answer = readline.question([
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
					answer = readline.question([
						chalk.white.bgBlue('Looks like the module "' + event.file+' doesn\'t exist, create it now?'),
						"[Y/n]\n"
					]);

					if ((answer.toUpperCase() === 'Y')) {
						grunt.log.writeln(chalk.white.bgBlue('Creating new module in file ') + chalk.bold.white.bgGreen(' '+event.file+' '));
						grunt.log.writeln('---');

						srcWriter.writeModule(event.file);
					}
					break;

				case 'E_NOENT_OBJECT':
					answer = readline.question([
						chalk.white.bgBlue('Looks like the object "' + event.file+' doesn\'t exist, create it now?'),
						"[Y/n]\n"
					]);

					if ((answer.toUpperCase() === 'Y')) {
						grunt.log.writeln(chalk.white.bgBlue('Creating new AMD object file: ') + chalk.bold.white.bgGreen(' '+event.file+' '));
						grunt.log.writeln('---');

						srcWriter.writeObject(event.file);
					}
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

				collaboratorWriter.write(grunt.file.readYAML('collaborators.yml'), moduleRoot);

				grunt.task.run('jasmine');
				break;

			case 'module':
			case 'object':
				var specFilename = 'spec/' + specName + '.js';

				if (grunt.file.exists(specFilename)) {

					var answer = readline.question([
						chalk.white.bgBlue('The file ' + specFilename + ' already exists, would you like to overwrite it?'),
						'[y/N]'
					]);

					(answer.toUpperCase() === 'Y') && grunt.file.delete(specFilename);
				}

				if (typeof answer === 'undefined' || answer.toUpperCase() === 'Y') {
					grunt.log.writeln(chalk.white.bgBlue('Creating ' + command + ' spec in: ' + specFilename));
					command === 'module' ? specWriter.writeModule(specFilename, specName) : specWriter.writeObject(specFilename, specName) ;
				}
				break;
		}


	});



};


