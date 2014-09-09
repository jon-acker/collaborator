define(['spec-object!tester'], function(tester) {

    describe('tester', function() {

        it('is an instance of object', function() {
            expect(typeof tester).toBe('object');
		});

    });

});