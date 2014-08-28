define(function() {
	'use strict'

    return {
        load: function(requiredModule, req, loader, config) {
			requiredModule = requiredModule.replace('double/', 'src/');
			req([requiredModule], function (module) {
				loader(module);
			}, function (e) {
				throw JSON.stringify({error: 'E_NOENT_MODULE', file: e.requireModules[0]});
			});

		}
    }
});