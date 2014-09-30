module.exports = function() {
	var childProcess = require('child_process');
	var grunt = require('grunt');

	var commandOutput = '';

	var currentChildProcess = null;

	var matches = {createNewModule: false};

	this.Given(/^there are no specs$/, function (callback) {
		childProcess.exec('rm -rf spec/');
		callback();
	});

	this.Given(/^there are no source files/, function (callback) {
		childProcess.exec('rm -rf src/');
		callback();
	});

	this.When(/^I run the command "([^"]*)"$/, function (command, callback) {
		var cmd = command.split(/\s/);
		var gruntSpecProcess = childProcess.spawn(cmd[0], [cmd[1]], {stdio: ['pipe', 'pipe', 'pipe']});
		currentChildProcess = gruntSpecProcess;

		gruntSpecProcess.stdout.on('data', function(data) {

			if (data.toString().match(/Looks like the .* doesn\'t exist, create it now/)) {
				callback();
			}

			commandOutput = data.toString();
		});

		callback();
	});

	this.Then(/^I should see "([^"]*)"$/, function (expectedOutput, callback) {
		currentChildProcess.stdout.on('data', function(data) {
			var pattern = new RegExp('(' + expectedOutput.replace('/', '\\/') + ')');
			var dataString = commandOutput.replace(/[^a-zA-Z0-9_\\/\s\.:]+/g, '');
			var output = dataString.match(pattern);

			if (output && output[1] == expectedOutput) {
				currentChildProcess.on('close', function(code) {
					callback(code);
				});
			}
		});
	});

	this.Then(/^the file "([^"]*)" should have been created with these contents:$/, function (fileName, expectedContents, callback) {
		var fileContents = grunt.file.read(fileName);

		callback(fileContents === expectedContents ? 0 : 'File contents did not match expectation');
	});

	this.Given(/^there is a spec "([^"]*)"$/, function (specName, specContents, callback) {
		grunt.file.write('spec/' + specName + '.js', specContents);

		callback(0);
	});

	this.Then(/^I should be asked whether I want to create the file$/, function (callback) {
		// Write code here that turns the phrase above into concrete actions
		callback();
	});

	this.When(/^I say that I do want to create the file$/, function (callback) {
		currentChildProcess.stdin.write('Y\n');
		callback();
	});
};
