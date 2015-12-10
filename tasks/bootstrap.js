'use strict';

var grunt = require('grunt');

module.exports.configure = function (moduleRoot) {
    var collaboratorRoot = process.cwd() + '/' + moduleRoot + 'collaborator/';
    grunt.config('grunt-spec-config', collaboratorRoot + 'collaborator-requirejs-config.js');
    grunt.config('moduleRoot', moduleRoot);
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    var config = grunt.config();
    var srcDir = config.gruntSpec && config.gruntSpec.src ? config.gruntSpec.src : 'src/';
    var specDir = config.gruntSpec && config.gruntSpec.spec ? config.gruntSpec.spec : 'spec/';

    config.gruntSpec = {
        src: srcDir,
        spec: specDir
    };

    config.jasmine = {
        options: {
            keepRunner: true,
            specs: specDir + '**/*.js',
            template: require('grunt-template-jasmine-requirejs'),
            templateOptions: {
                requireConfigFile: grunt.config('grunt-spec-config'),
                requireConfig: {
                    baseUrl: srcDir,
                    specDirSrc: srcDir,
                    specDirSpec: specDir,
                    paths: {
                        collaborator: collaboratorRoot + 'collaborator',
                        'spec-object': collaboratorRoot + 'spec-object',
                        'spec-module': collaboratorRoot + 'spec-module',
                        'spec-class': collaboratorRoot + 'spec-class',
                        'collaborator/definer': collaboratorRoot + 'definer',
                        'collaborators': collaboratorRoot + '../.grunt/grunt-spec/collaborators',
                        'requirements': collaboratorRoot + '../.grunt/grunt-spec/requirements',
                        'collaborator/builder': collaboratorRoot + 'builder'
                    }
                }
            }
        }
    };

    config.jasmine[srcDir] = [];

    grunt.initConfig(config);
};

