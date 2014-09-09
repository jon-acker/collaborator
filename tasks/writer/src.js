'use strict';

var grunt = require('grunt');
var mustache = require('mustache');

/**
 * Write src file for module example
 *
 * @param moduleName
 */
module.exports.writeModule = function writeSrcModule(fileName) {
	var srcTemplate = grunt.file.read(grunt.config().moduleRoot + 'tasks/writer/template/module.js.src');
	var moduleName = fileName.split('\/').pop();

	grunt.file.write(
		grunt.config().gruntSpec.src + fileName + '.js',
		mustache.render(srcTemplate, {
			moduleNameUC: moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
		})
	);
};


/**
 * Write src file for object example
 *
 * @param fileName
 */
module.exports.writeObject = function writeSrcModule(fileName) {
	var srcTemplate = grunt.file.read(grunt.config().moduleRoot + 'tasks/writer/template/object.js.src')
	grunt.file.write(
		grunt.config().gruntSpec.src + fileName + '.js',
		mustache.render(srcTemplate)
	);
};