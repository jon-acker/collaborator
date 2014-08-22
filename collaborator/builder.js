define(['collaborator/definer'], function(definer) {
    'use strict';

    var DOUBLES_PREFIX = 'double/';

    function _createDependencyMap(collaborators) {
        var dependencyMap = {};

        Object.keys(collaborators).forEach(function(moduleName) {
            dependencyMap['*'] = dependencyMap[moduleName] || {};

            Object.keys(collaborators).forEach(function(requiredModule) {
                definer.defineDouble(requiredModule, collaborators[requiredModule], DOUBLES_PREFIX);
                dependencyMap['*'][requiredModule] = DOUBLES_PREFIX + requiredModule;
            });
        });

        return dependencyMap;
    }

    return {
        createDependencyMap: function(collaborators) {
            return _createDependencyMap(collaborators);
        },
        DOUBLES_PREFIX: DOUBLES_PREFIX
    }
});