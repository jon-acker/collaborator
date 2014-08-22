define(function() {
	'use strict'

    return {
        load: function(requiredModule, req, loader, config) {
			req([requiredModule], function (module) {
				loader(module);
			}, function(e) {
				console.log('collaborator "'+ requiredModule + '" doesn\'t seem to exist yet');
			});
        }
    }
});