'use strict';

module.exports = function (grunt) {

    var chalk = require('chalk');
    var readline = require('readline-sync');
    var specWriter = require('./writer/spec');
    var srcWriter = require('./writer/src');
    var collaboratorWriter = require('./writer/collaborator');
    var bootstrap = require('./bootstrap');

    var packageJsonPath = process.cwd() + '/package.json';
    var moduleName = 'grunt-spec';
    var moduleRoot = 'node_modules/' + moduleName + '/';
    var childProcess = require('child_process');

    if (grunt.file.exists(packageJsonPath) && require(packageJsonPath).name === moduleName) {
        moduleRoot = '';
    }

    bootstrap.configure(moduleRoot);

    grunt.event.on('jasmine.specDone', function (event) {
        var matches;

        if (event.status === 'failed' && (matches = event.failedExpectations[0].message.match(/is not a function \(evaluating \'(\w+)\.(\w+)\(.*\).*in.file:\/\/(.*).\(/))) {
            grunt.log.writeln(chalk.red.bold('\n\nYour ' + chalk.green(matches[1]) + ' doesn\'t seem to have a method called ' + chalk.green(matches[2]) + '.\n'));
            process.exit(1);
        }
    });

    grunt.event.once('error.onError', function (event) {
        if (typeof event === 'string') {
            var answer = '';
            event = JSON.parse(event);

            switch (event.error) {
                case 'E_NOENT_COLLABORATOR':
                    event.file = event.file.replace(/^double\//, '');
                    grunt.log.writeln(chalk.white.bold.bgRed('Non existent module or collaborator: "' + event.file + '"\n'));
                    answer = readline.question(
                        chalk.white.bgBlue('Would you like me to set up a collaborator/spy? [Y/n]'),
                        { defaultInput: 'Y' }
                    );

                    if ((answer.toUpperCase() === 'Y')) {
                        collaboratorWriter.add(event.file);
                        collaboratorWriter.addRequirement(event.file);
                        grunt.log.writeln(chalk.blue(
                            'Collaborator interface  ' + event.file + ' created.\n' +
                            'Add the module for whom this collaborator is mocked into requirements.yml\n' +
                            'Add the methods you want to mock for ' + event.file + ' in collaborators.yml\n' +
                            'Run grunt:run again\n'
                        ));
                    }
                    break;

                case 'E_ERROR_SRC':
                    grunt.log.writeln(chalk.white.bgRed('Missing src file? ' + event.file));
                    break;

                case 'E_NOENT_MODULE':
                case 'E_NOENT_OBJECT':
                case 'E_NOENT_CLASS':
                    var type = '';

                    answer = readline.question(
                        'Looks like ' + type + ' ' + event.file + ' does not exist, create it now? [Y/n]', {defaultInput: 'Y'}
                    );

                    if ((answer.toUpperCase() === 'Y')) {
                        switch (event.error) {
                            case 'E_NOENT_MODULE':
                                srcWriter.writeModule(event.file);
                                type = 'module';
                                break;

                            case 'E_NOENT_OBJECT':
                                srcWriter.writeObject(event.file);
                                type = 'object';
                                break;

                            case 'E_NOENT_CLASS':
                                srcWriter.writeClass(event.file);
                                type = 'class';
                                break;
                        }

                        grunt.log.writeln(chalk.white.bgBlue('Creating new module ') + chalk.bold.white.bgGreen(' ' + event.file + ' '));
                        grunt.log.writeln(chalk.white.bgRed('Run grunt spec:run again ...'));
                    }
                    break;
            }

            process.exit(0);
        }
    });

    function getSpecPath(specName) {
        return grunt.config().gruntSpec.spec + specName + '.js';
    }

    grunt.registerTask('spec', 'Spec objects with Jasmine', function (command, specName) {
        switch (command) {
            // run jasmine tests
            case 'run':
                if (!grunt.file.exists('collaborators.yml')) {
                    grunt.file.write('collaborators.yml');
                }

                if (!grunt.file.exists('requirements.yml')) {
                    grunt.file.write('requirements.yml');
                }

                collaboratorWriter.writeCollaborators(grunt.file.readYAML('collaborators.yml'));
                collaboratorWriter.writeRequirements(grunt.file.readYAML('requirements.yml'));

                if (specName) {
                    grunt.config('jasmine.options.specs', getSpecPath(specName));
                }

                grunt.task.run('jasmine');
                break;

            case 'module':
            case 'object':
            case 'class':
                var specFilename = getSpecPath(specName);

                if (grunt.file.exists(specFilename)) {
                    var answer = readline.question(
                        chalk.white.bgBlue('The file ' + specFilename + ' already exists, would you like to overwrite it? [y/N]'),
                        { defaultInput: 'N'}
                    );

                    (answer.toUpperCase() === 'Y') && grunt.file.delete(specFilename);
                }

                if (typeof answer === 'undefined' || answer.toUpperCase() === 'Y') {
                    grunt.log.writeln(chalk.white.bgBlue('Creating ' + command + ' spec in: ' + specFilename));
                    command === 'module' && specWriter.writeModule(specFilename, specName);
                    command === 'object' && specWriter.writeObject(specFilename, specName);
                    command === 'class' && specWriter.writeClass(specFilename, specName);
                }
                break;

            default:
                grunt.log.writeln(chalk.white.bgBlue('Unrecognized command: ' + command));
                process.exit(1);
        }

    });

};


