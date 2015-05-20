'use strict';

var grunt = require('grunt');
var mustache = require('mustache');

/**
 *
 * @param {array} namespaceParts
 * @returns {array}
 */
function capitalizeNamespaceParts(namespaceParts) {
	var capitalizedNamespaceParts = namespaceParts.map(function (part) {
		return part.charAt(0).toUpperCase() + part.slice(1);
	});
	return capitalizedNamespaceParts;
}

/**
 *
 * @param {string} specFilename
 * @param {string} specName
 */

module.exports.writeModule = function writeModuleSpec(specFilename, specName) {
	var moduleTemplate = grunt.file.read(grunt.config().moduleRoot + 'tasks/writer/template/module.js.spec');
	var namespaceParts = specName.split('/');
	var moduleName = namespaceParts[namespaceParts.length - 1];
	var capitalizedNamespaceParts = capitalizeNamespaceParts(namespaceParts);

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
	var moduleTemplate = grunt.file.read(grunt.config().moduleRoot + 'tasks/writer/template/object.js.spec');
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

/**
 *
 * @param {string} specFilename
 * @param {string} specName
 */
module.exports.writeClass = function writeClass(specFilename, specName) {
	var moduleTemplate = grunt.file.read(grunt.config().moduleRoot + 'tasks/writer/template/class.js.spec');
	var namespaceParts = specName.split('/');
	var moduleName = namespaceParts[namespaceParts.length - 1];
	var capitalizedNamespaceParts = capitalizeNamespaceParts(namespaceParts);

	grunt.file.write(
		specFilename,
		mustache.render(moduleTemplate, {
			specFilename: specFilename,
			specName: specName,
			moduleName: moduleName,
			longModuleName: capitalizedNamespaceParts.join(' '),
			moduleNameLC: moduleName.toLowerCase(),
            moduleNameUC: capitalizedNamespaceParts[capitalizedNamespaceParts.length-1]
		})
	)
};
