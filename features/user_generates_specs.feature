Feature: Generating specs

  Scenario: Generating an object spec
    Given there are no specs
     When I run the command "grunt spec:object:acme/finder"
     Then I should see "Creating object spec in: spec/acme/finder.js"
      And the file "spec/acme/finder.js" should have been created with these contents:
"""
define(['spec-object!acme/finder'], function(finder) {

    describe('acme finder', function() {

        it('is an instance of object', function() {
            expect(typeof finder).toBe('object');
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

  Scenario: Generating a factory spec
    Given there are no specs
    When I run the command "grunt spec:factory:acme/personFactory"
    Then I should see "Creating factory spec in: spec/acme/personFactory.js"
    And the file "spec/acme/personFactory.js" should have been created with these contents:
"""
define(['spec-factory!acme/personFactory'], function(personFactory) {

    describe('Acme PersonFactory', function() {

        it('creates instances of objects', function() {
            var createdObject = personFactory.create();

            expect(typeof createdObject).toBe('object');
        });

    });

});
"""
