define(['spec-class!{{{specName}}}'], function({{{moduleNameUC}}}) {

    describe('{{{longModuleName}}}', function() {

        it('is an instance of {{{moduleNameUC}}}', function() {
            var {{{moduleNameLC}}} = new {{{moduleNameUC}}}();

            expect({{{moduleNameLC}}} instanceof {{{moduleNameUC}}}).toBe(true);
        });

    });

});