[![Build Status](https://travis-ci.org/jon-acker/collaborator.svg?branch=master)](https://travis-ci.org/jon-acker/collaborator)

grunt-spec / collaborator
=========================

You will need to install grunt:
```
sudo npm install -g grunt
```

To install the required modules run:
```
npm install -s grunt-spec
```

And create a default "Gruntfile.js" by copying the dist version
```sh
cp node_modules/grunt-spec/Gruntfile.js.dist Gruntfile.js
```

grunt-spec
----------

Grunt-spec is a tool designed to facilitate a workflow for developing Javascript AMD modules using TDD (in particular, Mockist TDD).
Grunt-spec was inspired by the PhpSpec and the positive workflow it facilitates for driving PHP application design [PhpSpec](http://www.phpspec.net/). 

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

Run "grunt spec:run" again, and you should see your first passing spec:
```
Acme Button
✓ is an instance of Button
```

collaborator
------------

Grunt spec uses RequireJS as  DIC to provide collaborators for jasmine specs. By default, the tool will offer to generate a collaborate mock when using the collaborator! requirejs plugin.

You will need to edit the file collaborators.yml manually in order to provide the method names your tests collaborators.
Specify the names of the collaborators methods explicitly, and a jasmine spy will be created for them.
If omit the name of your module from collaborators.yml, an existing module will be expected to be found in the corresponding src/ directory.

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

When you run "grunt spec:run" the collaborator! plugin will trigger the system to ask if you want to create the collaborator. Answer 'Y'. This will add the name of the module with an empty array for methods. We edit the file to specify that our parser will have a method "parse":

```yaml
acme/parser: [parse]
```

Edit the file requirements.yml to configure whether the your SuS (Subject under Spec) will require the real collaborator or the spy specified in collaborators.yml

If, for example your SuS is acme/calculator and its collaborating module is acme/parser, and you when the test runs you want your calculator module to require the fake not the real acme/parser, edit requirements.yml like so:

```yaml
acme/calculator: [acme/parser]
```

This tells RequireJS: when "acme/calculator" requires "acme/parser", then give it the spy instead. If you remove this requirment, it will expect to find acme/parser.js in the src/ folder.

Run "grunt spec:run" again, and the spec shold pass.

Viewing Jasmine HTML test runner in the Browser:
===============================================

Once "grunt spec:run" has finished executing, a filed called _SpecRunner.html is created in the projects root folder, you can load and run the specs in your browser by browsing to:

```
file:///project/folder/_SpecRunner.html
```

Running specs in specific folders or files:
===========================================
```
grunt spec:run:acme/*
grunt spec:run:acme/parser.js
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
