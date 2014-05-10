require.config({
    baseUrl: 'src/',
    map: {
        '*': {
            'collaborator/builder': '../collaborator/builder',
            'collaborator/definer': '../collaborator/definer',
            'collaborators': '../collaborators'
        }
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

