module.exports = function() {
	var childProcess = require('child_process');
	var fileSystem = require('fs');

	var commandOutput = '';

	var currentChildProcess = null;

	var matches = {createNewModule: false};

	this.Given(/^There are no specs$/, function (callback) {
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

		gruntSpecProcess.stdout.on('data', function(data) {

			if (data.toString().match(/Looks like the .* doesn\'t exist, create it now/)) {
				currentChildProcess = gruntSpecProcess;
				callback();
			}
		});

		gruntSpecProcess.on('close', function (code) {
			console.log('child process exited with code ' + code);
		});
	});

	this.Then(/^I should see "([^"]*)"$/, function (expectedOutput, callback) {
		currentChildProcess.stdout.on('data', function(data) {
			var pattern = eval('/(' + expectedOutput.replace('/', '\\/') + ')/');
			var dataString = data.toString().replace(/[^a-zA-Z0-9_\\/\s]+/g, '');
			var output = dataString.match(pattern);

			if (output && output[1] == expectedOutput) {
				callback();
			}
		});
	});

	this.Then(/^the file "([^"]*)" should have been created with these contents:$/, function (fileName, expectedContents, callback) {
		var fileContents = fileSystem.readFileSync(fileName);

		callback(fileContents.toString() === expectedContents ? 0 : 'File contents did not match expectation');
	});

	this.Given(/^there is a spec "([^"]*)"$/, function (specName, specContents, callback) {
		fileSystem.writeFileSync('spec/' + specName + '.js', specContents);

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
