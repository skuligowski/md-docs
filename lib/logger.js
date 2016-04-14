var debug = false,
	chalk = require('chalk'),
	stackTrace = require('stack-trace'),
	path = require('path');

var colors = {
	DEBUG: {
		label: chalk.bgCyan.black,
		line: chalk.cyan
	},
	WARN: {
		label: chalk.bgYellow.black,
		line: chalk.yellow
	},
	ERROR: {
		label: chalk.bgRed.white,
		line: chalk.red
	}
}

function LogError() {
	var args = Array.prototype.slice.call(arguments);
	this.message = args.join(' ');
	this.parts = arguments;
	this.line = getLineNumber('ERROR');
};

require('util').inherits(LogError, Error);

function getLineNumber(level, depth) {
	if (!debug)
		return;

	var trace = stackTrace.get(),
		fileName = path.basename(trace[depth || 2].getFileName()),
		lineNumber = trace[depth || 2].getLineNumber();
	
	return colors[level].line(['(', fileName, ':', lineNumber, ')'].join(''));
}

function log(level, lineNumber, argsObject) {
	var message = []
		messageParts = Array.prototype.slice.call(argsObject);

	message.push(colors[level].label(level));
	if (lineNumber) {
		message.push(lineNumber);
	}
	message = message.concat(messageParts);
	console.log.apply(null, message);
}

module.exports = {
	colors: chalk,
	Error: LogError,
	info: function() {
		console.log.apply(null, arguments);
	},
	debug: function() {
		if (debug) {
			log('DEBUG', getLineNumber('DEBUG'), arguments);
		}
	},
	warn: function() {
		log('WARN', getLineNumber('WARN'), arguments);
	},
	error: function() {		
		var args = Array.prototype.slice.call(arguments),
			error = args[0];
		
		if (error instanceof LogError) {			
			log('ERROR', error.line, error.parts);
		} else if (error instanceof Error) {		
			log('ERROR', getLineNumber('ERROR'), [error.stack || error.message]);				
		} else {
			log('ERROR', getLineNumber('ERROR'), arguments);
		}
	},
	setDebug: function(enabled) {
		debug = enabled;
	}
}