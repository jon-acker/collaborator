module.exports = function() {
    var processSpawner = require('child_process');
    var grunt = require('grunt');

    this.Given(/^there are no collaborators/, function (callback) {
        processSpawner.exec('rm -rf collaborators.yml requirements.yml', callback);
    });

    this.When(/^I say that I do want to set up the collaborator$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback.pending();
    });
}
