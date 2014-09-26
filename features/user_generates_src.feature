Feature: Generating src

  Scenario: Being asked whether I want to create an object
    Given there is a spec "acme/calculator"
    """
define(['spec-object!acme/calculator'], function(calculator) {

    describe('calculator', function() {

        it('is an instance of object', function() {
            expect(typeof calculator).toBe('object');
        });

    });

});
"""
    And there are no source files
    When I run the command "grunt spec:run"
    Then I should be asked whether I want to create the file


  Scenario: Generating an object src when I say Yes
    Given there is a spec "acme/calculator"
"""
define(['spec-object!acme/calculator'], function(calculator) {

    describe('calculator', function() {

        it('is an instance of object', function() {
            expect(typeof calculator).toBe('object');
        });

    });

});
"""
      And there are no source files
     When I run the command "grunt spec:run"
      And I say that I do want to create the file
     Then I should see "Creating new module  acme/calculator"
      And the file "src/acme/calculator.js" should have been created with these contents:
"""
define(function() {

    return {

        //@todo: create methods here

    }

});
"""

#  Scenario: Not generating an object src when I say No
#    Given there is a spec "acme/calculator"
#    """
#define(['spec-object!acme/calculator'], function(calculator) {
#
#    describe('calculator', function() {
#
#        it('is an instance of object', function() {
#            expect(typeof calculator).toBe('object');
#        });
#
#    });
#
#});
#"""
#    And there are no source files
#    When I run the command "grunt spec:run"
#    And I say that I do not want to create the file
#    Then the file "src/acme/calculator.js" should not have been created
#
#
#  Scenario: Generating a module src
#    Given there is a spec "acme/person"
#"""
#define(['spec-module!acme/person'], function(person) {
#
#    describe('Acme Person', function() {
#
#        it('is an instance of object', function() {
#            expect(test.constructor.name).toBe('Person');
#        });
#
#    });
#
#});
#"""
#    When I run the command "grunt spec:run"
#    Then I should see "Creating module spec in: specx/acme/person.js"
#    And the file "src/acme/person.js" should have been created with these contents:
#"""
#define(['spec-module!acme/person'], function(person) {
#
#    describe('Person', function() {
#
#        it('is an instance of Person', function() {
#            expect(test.constructor.name).toBe('Person');
#        });
#
#    });
#
#});
#"""
