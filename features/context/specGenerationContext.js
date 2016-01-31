module.exports = function() {
    require('events').EventEmitter.prototype._maxListeners = 100;

	var processSpawner = require('child_process');
	var grunt = require('grunt');
	var pty = require('pty.js');

	var commandOutput = '';
	var currentprocessSpawner = null;

	var matchedExpectedOutput = false;

	this.Given(/^there are no specs$/, function (callback) {
        processSpawner.exec('rm -rf spec/', callback);
	});

	this.Given(/^there are no source files/, function (callback) {
		processSpawner.exec('rm -rf src/', callback);
	});

	this.When(/^I run the command "([^"]*)"$/, function (command, callback) {
		var cmd = command.split(/\s/);

		var gruntSpecProcess = pty.spawn(cmd[0], [cmd[1]]);
		currentprocessSpawner = gruntSpecProcess;
		currentprocessSpawner.stdout.on('data', function(data) {
			commandOutput += data.toString();
		});

		callback();
	});

	this.Then(/^I should see "([^"]*)"$/, function (expectedOutput, callback) {

		currentprocessSpawner.on('close', function(code) {
			if (!matchedExpectedOutput) {
				callback('Failed to match expected output, got: '+ commandOutput);
			}
		});

		currentprocessSpawner.stdout.on('data', function(data) {
			var pattern = new RegExp('(' + expectedOutput + ')');
			var dataString = commandOutput.replace(/[^a-zA-Z0-9_\\/\s\.:\?\',]+/g, '').replace(/[\d]{1,2}m/g, '');
            var output = dataString.match(pattern);

			if (output && output[1] == expectedOutput) {
				matchedExpectedOutput = true;
				currentprocessSpawner.on('close', function(code) {
                    callback(code);
				});
			}
		});
	});

	this.Given(/^there is a spec "([^"]*)"$/, function (specName, specContents, callback) {
		grunt.file.write('spec/' + specName + '.js', specContents);

		callback();
	});

	this.Then(/^I should be asked whether I want to create the file$/, function (callback) {
		currentprocessSpawner.stdout.on('data', function(data) {
			if (data.toString().match(/Looks like .* does not exist, create it now/)) {
				currentprocessSpawner.stdout.write('\n');
				callback();
			}
		});
	});

	this.When(/^I say that I do want to (.*)$/, function (text, callback) {
		currentprocessSpawner.stdout.write("Y\n");
		callback();
	});

	this.When(/^I say that I do not want to (.*)$/, function (text, callback) {
		currentprocessSpawner.stdout.write('N\n');
		callback();
	});

	this.Then(/^the file "([^"]*)" should not have been created$/, function (file, callback) {
		if (!grunt.file.exists(file)) {
			callback()
		}
	});

	this.Then(/^the file "([^"]*)" should have been created with these contents:$/, function (fileName, expectedContents, callback) {
		var fileContents = grunt.file.read(fileName);
		callback(fileContents == expectedContents ? 0 : 'File contents did not match expectation:\n' + fileContents);
	});
};
