var grunt = require('grunt');
require.config({

    deps: [
        '../.grunt/grunt-spec/collaborators',
        '../.grunt/grunt-spec/requirements',
        'collaborator/builder'
    ],
    callback: function(collaborators, requirements, collaboratorBuilder) {
		require.config({
            map: collaboratorBuilder.createDependencyMap(collaborators, requirements)
        });
    }
});

