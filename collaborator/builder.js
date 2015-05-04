define(['collaborator/definer'], function(definer) {
    'use strict';

    var DOUBLES_PREFIX = 'double/';

    function _createDependencyMap(collaborators, requirements) {
        var dependencyMap = {};

        Object.keys(requirements).forEach(function(requirement) {
            dependencyMap[requirement] = dependencyMap[requirement] || {};

            Object.keys(collaborators).forEach(function(requiredModule) {
                if (requirements[requirement].indexOf(requiredModule) !== -1) {
                    definer.defineDouble(requiredModule, collaborators[requiredModule], DOUBLES_PREFIX);
                    dependencyMap[requirement][requiredModule] = DOUBLES_PREFIX + requiredModule;
                }
            });
        });

        return dependencyMap;
    }

    return {
        createDependencyMap: function(collaborators, requirements) {
            return _createDependencyMap(collaborators, requirements);
        },
        DOUBLES_PREFIX: DOUBLES_PREFIX
    }
});