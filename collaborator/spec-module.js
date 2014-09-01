define(function() {
	'use strict'

    return {
        load: function(requiredModule, req, loader, config) {
			if (requiredModule.indexOf('double/') === 0) {
				requiredModule = requiredModule.replace('double/', '');
			}

			var modulePath = 'src/' + requiredModule;

			req([modulePath], function (module) {
				loader(module);
			}, function (e) {
				throw JSON.stringify({error: 'E_NOENT_MODULE', file: requiredModule});
			});

		}
    }
});