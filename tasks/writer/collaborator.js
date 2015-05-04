'use strict';

var grunt = require('grunt');
var jsYaml = require('js-yaml');

/**
 *
 * @param {elements} array
 * @param {string} name
 */
function ymlToAmd(elements, name) {
    var formattedElements = '';
    elements = elements || {};
    Object.keys(elements).forEach(function (element, index) {
        formattedElements += "    '" + element + "': [" + elements[element].map(function (c) {
            return "'" + c + "'"
        }) + "]";
        formattedElements += index < Object.keys(elements).length - 1 ? ",\n" : "";
    });

    grunt.file.write('.grunt/grunt-spec/' + name + '.js', "define({\n" + formattedElements + "\n});\n");
}

/**
 * Create collaborators js from YAML file
 *
 * @param {array} collaborators
 */
module.exports.writeCollaborators = function writeCollaborators(collaborators) {
    ymlToAmd(collaborators, 'collaborators');
};

/**
 * Create requirements js from YAML file
 *
 * @param {array} requirements
 */
module.exports.writeRequirements = function writeRequirements(requirements) {
    ymlToAmd(requirements, 'requirements');
};

/**
 * Add new collaborator into YAML file
 *
 * @param {string} modulePath
 */
module.exports.add = function addCollaborator(modulePath) {
	var collaborators = grunt.file.readYAML('collaborators.yml');
	collaborators = collaborators || {};
	collaborators[modulePath] = [];
	grunt.file.write('collaborators.yml', jsYaml.safeDump(collaborators, {flowLevel: 1}));
};

/**
 * Add default requirements into YAML file
 *
 * @param {string} modulePath
 */
module.exports.addRequirement = function addRequirement(modulePath) {
    var requirements = grunt.file.readYAML('requirements.yml');
    requirements = requirements || {};
    requirements['replace/with/module/path'] = [modulePath];
    grunt.file.write('requirements.yml', jsYaml.safeDump(requirements, {flowLevel: 1}));
};