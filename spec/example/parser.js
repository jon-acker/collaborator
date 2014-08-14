define(['example/parser'], function(parser) {

	describe('Parser Module', function() {


        xit ('parses something', function() {
             expect(parser.parse('1 :: 2')).toEqual([1,2]);
        });

    });

});