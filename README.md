[![Build Status](https://travis-ci.org/jon-acker/collaborator.svg?branch=master)](https://travis-ci.org/jon-acker/collaborator)

grunt-spec / collaborator
=========================

You will need to install grunt:
```
sudo npm install -g grunt
```

And create a file called "Gruntfile.js" with these contents:
```javascript
module.exports = function(grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-spec');
};
```


To install the required modules run:
```
npm install grunt-spec
```

grunt-spec
----------

Grunt-spec is a tool designed to facilitate a workflow for developing Javascript AMD modules using TDD (in particular, Mockist TDD).
Grunt-spec was inspired by the PhpSpec and the positive workflow it facilitates for driving PHP application design ([PhpSpec](http://www.phpspec.net/) is courtesy of Marcello Duarte and Konstantin Kudryashov).

This tool uses Jasmine, Grunt and RequireJs under the hood. It will generate Jasmine spec files in the folder determined by your modules namespace (e.g. acme/page/formatter), using grunt spec plugin. When the specs are run (grunt spec:run) the tool will offer to generate
the skeleton of an Module-Under-Test (using an AMD object or module template)

The specs generated automatically insert one of two RequireJs plugins: spec-module! or spec-object! depending on whether you use
grunt spec:module:acme/something or spec:object:acme/something, respectively. Using these plugins, Grunt-spec is notified when the object to spec
is missing and will offer to create it.

There are currently only two AMD patterns supported:

#### object: plain object or anon service
```
grunt spec:object:acme/calculator
```
This will create a new AMD spec file in spec/acme/calculator.js returning {}

#### module constructed class of specific type
```
grunt spec:module:acme/button
```
This will create a new AMD spec file in spec/acme/button.js

Now run:
```
grunt spec:run
```

Grunt-spec will create a src module in src/acme/button.js



Using "grunt:module:acme/button" the following spec will be created by grunt spec:
```javascript
define(['spec-module!acme/button'], function(button) {
    describe('Namespace Button', function() {
        it('is an instance of Button', function() {
            expect(calculator.constructor.name).toBe('Button');
        });
    });
});
```

The spec-module! and the spec-object! requirejs plugin to force creating of module that doesn't exist yet.

Now run again:
```
grunt spec:run
```


On running "grunt spec:run", the spec-module! requirejs plugin will generate button module to be created in src/acme/button.js if none exists yet. The default pattern is an object factory which will look like this:
```javascript
define(function() {
    function Button() {
        //@todo: create methods here
    }

    return new Button();
});
```

collaborator
------------

Grunt spec uses RequireJS as  DIC to provide collaborators for jasmine specs. By default, the tool will offer to generate a collaborate mock when using the collaborator! requirejs plugin.

You will need to edit the file collaborators.yml manually in order to provide the method names your tests collaborators.
Specify the names of the collaborators methods explicitly, and a jasmine spy will be created for them.
If you use 'null' for the method names, an existing module will be expected to be found in the corresponding src/ directory.

```javascript
define(['collaborator!acme/parser', 'spec-object!acme/calculator'], function(calculator) {
    describe('Calculator', function() {
        it('parses the input and calculates value of string', function() {
            parser.parse.and.returnValue([1, 2]);
        
            expect(calculator.sum('1 2')).toBe(3);
            
            expect(parser.parse).toHaveBeenCalledWith('1 2');
        });
    });
});
```

Specify all expected collaborators explicitly in the file collaborators.yml, although the collaborator! plugin will add these for you automatically:
```yaml
acme/parser: [parse]
```

Configuring src and spec folders:
=====================================

By default grunt-spec assumes src/ and spec/ folders in relation to where grunt-spec is run. To override the defaults, add the following to your Gruntfile.js:
```
grunt.initConfig({
    gruntSpec: {
        src: 'path/to/my/src/',
        spec: 'path/to/my/specs/'
    }
});
```

Caveats
=======

Since "collaborator" creates a spy definition of each of the collaborators in the double/ base-namespace, you cannot currently use this base-namespace for anything else (but acme/double/etc is fine)
