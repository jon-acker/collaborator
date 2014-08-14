define(function() {
	'use strict'

    var collaboratorBuilder = require('collaborator/builder');

    return {
        load: function(requiredModule, req, loader, config) {
            console.log('loading: ' + requiredModule);
            req([requiredModule], function (module) {
                loader(module);
            });
        }
    }
});