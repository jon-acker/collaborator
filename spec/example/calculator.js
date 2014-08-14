define(['collaborator!parser', 'example/calculator'], function(parser, calculator) {

	describe('Calculator Module', function() {

		beforeEach(function() {
			for (var method in parser) {
				parser[method] = jasmine.createSpy(method);
			}
		});

        it ('calculates something', function() {
             expect(calculator.sum(1,2)).toBe(3);
        });

		it('calculates a string', function() {

			parser.parse.and.returnValue([1, 2]);

			var numbers = parser.parse('1 :: 2');
			expect(calculator.sum(numbers[0], numbers[1])).toBe(3);
		});

		it('calculates a string', function() {
			parser.parse.and.returnValue([1, 3]);

			var numbers = parser.parse('1 :: 3');
			expect(calculator.sum(numbers[0], numbers[1])).toBe(4);
		});
    });

});