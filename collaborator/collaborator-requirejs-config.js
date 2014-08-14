require.config({
    baseUrl: 'src/',
	paths: {
		collaborator: '../collaborator/plugin',
		'collaborator/definer': '../collaborator/definer',
		'collaborators': '../collaborators',
		'collaborator/builder': '../collaborator/builder'
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

