require.config({
    baseUrl: 'src/',
	paths: {
		collaborator: '../node_modules/grunt-spec/collaborator/plugin',
		spec: '../node_modules/grunt-spec/collaborator/spec',
		'collaborator/definer': '../node_modules/grunt-spec/collaborator/definer',
		'collaborators': '../node_modules/grunt-spec/collaborator/collaborators',
		'collaborator/builder': '../node_modules/grunt-spec/collaborator/builder'
	},
    deps: [
        'collaborators',
        'collaborator/builder'
    ],
    callback: function(collaborators, collaboratorBuilder) {
        require.config({
            map: {}//collaboratorBuilder.createDependencyMap(collaborators)
        });
    }
});

