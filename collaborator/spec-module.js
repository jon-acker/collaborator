define(function() {
	'use strict'

    return {
        load: function(requiredModule, req, loader, config) {
			var modulePath = 'src/' + requiredModule;
			req([modulePath], function (module) {
				loader(module);
			}, function (e) {
				throw JSON.stringify({error: 'E_NOENT_MODULE', file: requiredModule});
			});

		}
    }
});