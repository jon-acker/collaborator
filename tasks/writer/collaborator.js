'use strict';

var grunt = require('grunt');
var jsYaml = require('js-yaml');

/**
 * Create collaborators js from yaml file
 *
 * @param collaborators
 */
module.exports.write = function writeCollaborators(collaborators, moduleRoot) {
	var formattedCollaborators = '';
	collaborators = collaborators || {};
	Object.keys(collaborators).forEach(function(collaborator, index) {
		formattedCollaborators += "    '" + collaborator + "': [" + collaborators[collaborator].map(function(c) { return "'"+c+"'"}) + "]";
		formattedCollaborators += index < Object.keys(collaborators).length -1 ? ",\n" : "";
	});

	grunt.file.write(moduleRoot + 'collaborators.js', "define({\n" + formattedCollaborators + "\n});\n");
};

/**
 * Add new collaborator into YAML file
 *
 * @param modulePath
 */
module.exports.add = function addCollaborator(modulePath) {
	var collaborators = grunt.file.readYAML('collaborators.yml');
	collaborators = collaborators || {};
	collaborators[modulePath] = ['method'];
	grunt.file.write('collaborators.yml', jsYaml.safeDump(collaborators, {flowLevel: 1}));
};