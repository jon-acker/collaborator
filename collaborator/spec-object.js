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
				var error = e.toString().match(/Error\:\sScript\serror\sfor\:\s*(.*)/);

				if (error[1]) {
					var expectedModule = error[1].replace(/^src\//, '');
					if (expectedModule === requiredModule) {
						throw JSON.stringify({error: 'E_NOENT_OBJECT', file: requiredModule});
					} else {
						throw JSON.stringify({error: 'E_ERROR_SRC', file: expectedModule});
					}
				}
			});
		}
	}
});