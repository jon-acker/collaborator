define(['spec-module!test'], function(test) {

    describe('Test', function() {

        it('is an instance of Test', function() {
            expect(test.constructor.name).toBe('Test');
        });

	});

});