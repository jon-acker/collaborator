var grunt = require('grunt');

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
}

