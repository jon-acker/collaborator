define(function () {

	return {
		parse: function(string) {
			return string.split(/\s+::\s+/).map(function(element) { return parseInt(element) });
		}
	}

});