grunt-spec / collaborator
=========================

grunt-spec
----------

Generate spec files in the relevant folder using grunt spec plugin
```
grunt spec:namepspace/module
```

In the spec itself, use the spec! requirejs plugin to force creating of module that doesn't exist yet:
```javascript
define(['spec!calculator'], function(calculator) {
    describe('Calculator', function() {
        it('is a Calculator', function() {
            expect(something).toBe(whatever);
        });
    });
});
```

collaborator
------------

Use require-js as  DIC to provide collaborators for jasmine specs.

Edit the file collaborators.js to provide a definition of your tests collaborators.
Specify the names of the collaborators methods explicitly, and a jasmine spy will be created for them.
If you use 'null' for the method names, an existing module will be expected to be found in the src/ directory.

```javascript
define(['collaborator!parser', spec!calculator'], function(calculator) {
    describe('Calculator', function() {
        it('is a Calculator', function() {
            expect(something).toBe(whatever);
        });
    });
});
```

Specifiy all expected collaborators in the file collaborators.js:
```javascript
define(function() {
    return {
        '*': {
            parser: ['parser']
        }
    };
});


To install the required modules run
```
npm install
```


