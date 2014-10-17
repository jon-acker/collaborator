define(function() {
	'use strict'

    return {
        load: function(requiredModule, req, loader, config) {
			if (requiredModule.indexOf('double/') === 0) {
				requiredModule = requiredModule.replace('double/', '');
			}

			req([requiredModule], function (module) {
				loader(module);
			}, function (e) {
				throw JSON.stringify({error: 'E_NOENT_FACTORY', file: requiredModule});
			});

		}
    }
});