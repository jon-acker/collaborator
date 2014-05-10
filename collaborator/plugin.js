define(function() {

    var collaboratorBuilder = require('collaborator/builder');
    
    return {
        load: function(requiredModule, req, load, config) {
            console.log('loading: ' + requiredModule);
            req(['double/' + requiredModule], function (module) {
                load(module);
            });
        }
    }
});