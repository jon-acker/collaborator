Feature: User generates collaborator

  Scenario: Generating collaborator and requirements
    Given there is a spec "acme/Person"
"""
define(['collaborator!acme/person/finder', 'spec-class!acme/Person'], function(finder, Person) {

    describe('Acme Person', function() {

        it('is an instance of object', function() {
            var person = new Person();

            expect(person instanceof Person).toBe(true);
        });

    });

});
"""
    And there are no collaborators
    When I run the command "grunt spec:run"
    And I say that I do want to set up the collaborator
    Then I should see "Collaborator interface  acme/person/finder created."
    And the file "collaborators.yml" should have been created with these contents:
"""
acme/person/finder: []

"""
    And the file "requirements.yml" should have been created with these contents:
"""
replace/with/module/path: [acme/person/finder]

"""