define(function() {
    'use strict'

    return {
        /**
         * Define a a test-double using requirejs-define, as a jasmine spy
         * Using either methods explicitly stated or implicit (requires module to exist)
         *
         * @param {string} requiredModule - ID of module to define test double for
         * @param {array|null} requiredMethods - Array of methods to define, null means mimic real object
         * @param {string} DOUBLES_PREFIX - e.g. 'double/'
         */
        defineDouble: function defineDouble(requiredModule, requiredMethods, DOUBLES_PREFIX) {
            if (null === requiredMethods) {
                define(DOUBLES_PREFIX + requiredModule, [requiredModule], function (module) {
                    return jasmine.createSpyObj(requiredModule, Object.keys(module));
                });
            } else {
                define(DOUBLES_PREFIX + requiredModule, function () {
                    return jasmine.createSpyObj(requiredModule, requiredMethods);
                });
            }
        }
    }
});