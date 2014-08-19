'use strict';

module.exports = function(grunt) {
	var chalk = require('chalk');
	var readline = require('readline-sync');

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

	grunt.event.once('error.onError', function(event) {
		if (typeof event === 'string') {

			event = JSON.parse(event);

			if (event.error === 'E_NOENT') {

				grunt.log.writeln(chalk.bold.red('Module not found: ') + chalk.bold.grey(event.file));
				grunt.log.writeln(chalk.bold.red('Creating new module...file ') + chalk.bold.grey(event.file));
				grunt.log.writeln();

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

	grunt.registerTask('spec', 'Spec objects with Jasmine', function(specName) {

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

	});

};


