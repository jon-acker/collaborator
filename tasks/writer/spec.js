'use strict';

var grunt = require('grunt');
var mustache = require('mustache');

/**
 *
 * @param {string} specFilename
 * @param {string} specName
 */

module.exports.writeModule = function writeModuleSpec(specFilename, specName) {
	var moduleTemplate = grunt.file.read(process.cwd() + '/tasks/writer/template/module.js.spec');
	var namespaceParts = specName.split('/');
	var moduleName = namespaceParts[namespaceParts.length - 1];
	var capitalizedNamespaceParts = namespaceParts.map(function(part) {
		return part.charAt(0).toUpperCase() + part.slice(1);
	});

	grunt.file.write(
		specFilename,
		mustache.render(moduleTemplate, {
			specFilename: specFilename,
			specName: specName,
			moduleName: moduleName,
			longModuleName: capitalizedNamespaceParts.join(' '),
			moduleNameUC: capitalizedNamespaceParts[capitalizedNamespaceParts.length-1]
		})
	)
};

/**
 *
 * @param {string} specFilename
 * @param {string} specName
 */
module.exports.writeObject= function writeObjectSpec(specFilename, specName) {
	var moduleTemplate = grunt.file.read(process.cwd() + '/tasks/writer/template/object.js.spec');
	var namespaceParts = specName.split('/');
	var moduleName = namespaceParts[namespaceParts.length - 1];

	grunt.file.write(
		specFilename,
		mustache.render(moduleTemplate, {
			specFilename: specFilename,
			specName: specName,
			moduleName: moduleName,
			longModuleName: namespaceParts.join(' ')
		})
	)
};
