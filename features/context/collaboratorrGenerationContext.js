module.exports = function() {
    var processSpawner = require('child_process');
    var grunt = require('grunt');

    this.Given(/^there are no collaborators/, function (callback) {
        processSpawner.exec('rm -rf collaborators.yml requirements.yml', callback);
    });
};
