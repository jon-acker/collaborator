Feature: Triggering the generation of source files by running specs

  Background:
    Given there are no specs
      And there are no source files

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
    When I run the command "grunt spec:run"
    Then I should be asked whether I want to create the file

#################################################################

  Scenario: Generating an object source file when I say Yes
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

#################################################################

  Scenario: Not generating an object src when I say No
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
    When I run the command "grunt spec:run"
     And I say that I do not want to create the file
    Then the file "src/acme/calculator.js" should not have been created

#################################################################

  Scenario: Generating a module source file
    Given there is a spec "acme/person"
"""
define(['spec-module!acme/person'], function(person) {

    describe('Acme Person', function() {

        it('is an instance of object', function() {
            expect(test.constructor.name).toBe('Person');
        });

    });

});
"""
    When I run the command "grunt spec:run"
    Then I should be asked whether I want to create the file

