define(['collaborator/definer'], function(definer) {
    'use strict';

    var DOUBLES_PREFIX = 'double/';

    function _createDependencyMap(collaborators) {
        var dependencyMap = {};

        Object.keys(collaborators).forEach(function(moduleName) {
            dependencyMap[moduleName] = dependencyMap[moduleName] || {};

            Object.keys(collaborators[moduleName]).forEach(function(requiredModule) {
                definer.defineDouble(requiredModule, collaborators[moduleName][requiredModule], DOUBLES_PREFIX);
                dependencyMap[moduleName][requiredModule] = DOUBLES_PREFIX + requiredModule;
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