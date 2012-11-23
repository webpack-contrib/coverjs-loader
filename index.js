/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var Reporter = require("coverjs/lib/reporters/Reporter");
exports.reportHtml = function(options) {
	if(typeof __$coverObject === "undefined") return;
	require("./style.css");
	var html = new HTMLReporter(__$coverObject, options).report();
	var div = document.createElement("div");
	div.setAttribute("class", "coverjs-report");
	div.innerHTML = html;
	document.body.appendChild(div);
}

function HTMLReporter(object, options){
	this.options = options || {};
	Reporter.call(this, object);
}
HTMLReporter.prototype = Object.create(Reporter.prototype);
HTMLReporter.prototype.report = function() {
	var result = "<h1>CoverJs</h1><ul>";

	for (var file in this.object){
		var fileReporter = new HTMLFileReporter(this.object[file]);

		var fileReport = fileReporter.report();
		var percentage = fileReporter.pass / fileReporter.total * 100;

		this.error += fileReporter.error;
		this.pass  += fileReporter.pass;
		this.total += fileReporter.total;

		result += '<li><h2 class="' + (percentage > (this.options.target || 90) ? 'ok' : 'low') + '">' + file + ' (' + Math.round(percentage) + '%)</h2>\n\n';
		if(percentage < 100) result += '<pre>' + fileReport + '</pre></li>';
	}

	return result + "</ul>";
}


function HTMLFileReporter(object){
	var open  = '<span class="{class}" data-count="{count}"><span class="count">{count}</span>';
	var close = '</span>';

	Reporter.FileReporter.call(this, object, open, close);
}
HTMLFileReporter.prototype = Object.create(Reporter.FileReporter.prototype);
HTMLFileReporter.prototype.generateOpen = function(count){
	return this.substitute(this.open, {
		'count': count,
		'class': count ? 'pass' : 'error'
	});
}
HTMLFileReporter.prototype.report = function() {

	var i, l, k;

	var code = this.object.__code;

	// generate array of all tokens
	var codez = code.split("").map(function(token) {
		if(token == "<") return "&lt;"
		if(token == ">") return "&gt;"
		if(token == "&") return "&amp;"
		return token;
	});

	// insert new strings that wrap the statements
	for (k in this.object){
		if (k == '__code') continue;

		var count = this.object[k];
		var range = k.split(':');

		this.total++;
		if (count) this.pass++;
		else this.error++;
		
		var start = range[0];
		while(/^[\t ]$/.test(codez[start-1])) start--;
		codez[start] = this.generateOpen(count) + codez[start];
		codez[range[1]] = codez[range[1]] + this.generateClose(count);
	}

	var result = codez.join("");

	return result;

}

