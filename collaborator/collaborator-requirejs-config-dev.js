require.config({
//    baseUrl: 'src/',
	paths: {
		collaborator: 'collaborator/collaborator',
		'spec-module': 'collaborator/spec-module',
		'spec-factory': 'collaborator/spec-factory',
		'collaborator/definer': 'collaborator/definer',
		'collaborators': 'collaborator/collaborators',
		'collaborator/builder': 'collaborator/builder'
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

