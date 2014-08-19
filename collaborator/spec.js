define(function() {
	'use strict'

    return {
        load: function(requiredModule, req, loader, config) {

			req([requiredModule], function (module) {
				loader(module);
			}, function (e) {
				throw JSON.stringify({error: 'E_NOENT', file: e.requireModules[0]});
			});

		}
    }
});