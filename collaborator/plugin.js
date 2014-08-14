define(function() {
	'use strict'

    var collaboratorBuilder = require('collaborator/builder');

    return {
        load: function(requiredModule, req, loader, config) {
            req(['double/' + requiredModule], function (module) {
                loader(module);
            });
        }
    }
});