define(function() {
	'use strict'

    return {
        load: function(requiredModule, req, loader, config) {
			req([requiredModule], function (module) {
				loader(module);
			}, function(e) {
				throw JSON.stringify({error: 'E_NOENT_COLLABORATOR', file: e.requireModules[0]});
			});
        }
    }
});