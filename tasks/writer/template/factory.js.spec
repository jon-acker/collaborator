define(['spec-factory!{{{specName}}}'], function({{{moduleName}}}) {

    describe('{{{longModuleName}}}', function() {

        it('creates instances of objects', function() {
            var createdObject = {{{moduleName}}}.create();

            expect(typeof createdObject).toBe('object');
        });

    });

});