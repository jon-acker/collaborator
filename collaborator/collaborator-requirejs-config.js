var grunt = require('grunt');
require.config({

    deps: [
        'collaborators',
        'requirements',
        'collaborator/builder'
    ],
    callback: function(collaborators, requirements, collaboratorBuilder) {
		require.config({
            map: collaboratorBuilder.createDependencyMap(collaborators, requirements)
        });
    }
});

