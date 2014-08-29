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

Generate spec files in the relevant folder using grunt spec plugin

There are currently only two AMD patterns supported:

#### object: plain object or anon service
```
grunt spec:object:acme/calculator
```
This will create a new AMD spec file in spec/namespace/calculator.js returning {}

#### module constructed class of specific type
```
grunt spec:module:acme/button
```
This will create a new AMD spec file in spec/namespace/button.js



The following spec will be created by grunt spec:
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

Now run
```
grunt spec:run
```


On running "grunt spec:run", the spec-module! requirejs plugin will generate button module to be created in src/namespace/button.js if none exists yet. The default pattern is an object factory which will look like this:
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

Use require-js as  DIC to provide collaborators for jasmine specs.

Edit the file collaborators.yml to provide a definition of your tests collaborators. This file will be generated automatically.
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

Specifiy all expected collaborators explicitly in the file collaborators.yml, although the collaborator! plugin will add these for you automatically:
```yaml
acme/parser: [parse]
```



