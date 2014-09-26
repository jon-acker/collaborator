define(['spec-module!{{{specName}}}'], function({{{moduleName}}}) {

    describe('{{{longModuleName}}}', function() {

        it('is an instance of {{{moduleNameUC}}}', function() {
            expect({{{moduleName}}}.constructor.name).toBe('{{{moduleNameUC}}}');
        });

    });

});