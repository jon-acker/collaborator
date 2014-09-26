Feature: Generating specs

  Scenario: Generating an object spec
    Given there are no specs
     When I run the command "grunt spec:object:test"
     Then I should see "Creating object spec in: spec/test.js"
      And the file "spec/test.js" should have been created with these contents:
"""
define(['spec-object!test'], function(test) {

    describe('test', function() {

        it('is an instance of object', function() {
            expect(typeof test).toBe('object');
		});

    });

});
"""

  Scenario: Generating a module spec
    Given there are no specs
    When I run the command "grunt spec:module:acme/person"
    Then I should see "Creating module spec in: spec/acme/person.js"
    And the file "spec/acme/person.js" should have been created with these contents:
"""
define(['spec-module!acme/person'], function(person) {

    describe('Acme Person', function() {

        it('is an instance of Person', function() {
            expect(person.constructor.name).toBe('Person');
        });

    });

});
"""
