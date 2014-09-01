var grunt = require('grunt');
require.config({

    deps: [
        'collaborators',
        'collaborator/builder'
    ],
    callback: function(collaborators, collaboratorBuilder) {
		require.config({
            map: collaboratorBuilder.createDependencyMap(collaborators)
        });
    }
});

