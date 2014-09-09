define(['spec-module!blah/module'], function(module) {

    describe('Blah Module', function() {

        it('is an instance of Module', function() {
            expect(module.constructor.name).toBe('Module');
        });

	});

});