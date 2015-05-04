define(['spec-class!{{{specName}}}'], function({{{moduleName}}}) {

    describe('{{{longModuleName}}}', function() {

        it('is an instance of {{{moduleName}}}', function() {
            var {{{moduleNameLC}}} = new {{{moduleName}}}();

            expect({{{moduleNameLC}}} instanceof {{{moduleName}}}).toBe(true);
        });

    });

});