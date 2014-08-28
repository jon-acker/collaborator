require.config({
	paths: {
		collaborator: 'node_modules/grunt-spec/collaborator/collaborator',
		'spec-module': 'node_modules/grunt-spec/collaborator/spec-module',
		'spec-factory': 'node_modules/grunt-spec/collaborator/spec-factory',
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

