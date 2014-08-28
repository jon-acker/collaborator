require.config({
	paths: {
		collaborator: 'node_modules/grunt-spec/collaborator/collaborator',
		'spec-object': 'node_modules/grunt-spec/collaborator/spec-object',
		'spec-module': 'node_modules/grunt-spec/collaborator/spec-module',
		'collaborator/definer': 'node_modules/grunt-spec/collaborator/definer',
		'collaborators': 'node_modules/grunt-spec/collaborator/collaborators',
		'collaborator/builder': 'node_modules/grunt-spec/collaborator/builder'
	},
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

