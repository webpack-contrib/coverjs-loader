/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var path = require("path");
var Instrument = require("coverjs/lib/Instrument");
module.exports = function(source) {
	this.cacheable && this.cacheable();
	try {
		return new Instrument(source, {
			name: this.request
		}).instrument();
	} catch(e) {
		this.emitWarning && this.emitWarning(this.request + " cannot be instrumented: " + e);
		return source;
	}
}
module.exports.seperable = true;