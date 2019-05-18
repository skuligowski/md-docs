let debug = false;

const chalk = require('chalk').default;
const stackTrace = require('stack-trace');
const path = require('path');

const colors = {
	DEBUG: {
		label: chalk.bgCyan.black,
		line: chalk.cyan,
	},
	WARN: {
		label: chalk.bgYellow.black,
		line: chalk.yellow,
	},
	ERROR: {
		label: chalk.bgRed.white,
		line: chalk.red,
	}
};

function LogError() {
	const args = Array.prototype.slice.call(arguments);
	this.message = args.join(' ');
	this.parts = arguments;
	this.line = getLineNumber('ERROR');
}

require('util').inherits(LogError, Error);

function getLineNumber(level, depth) {
	if (!debug)
		return;

	const trace = stackTrace.get();
	const fileName = path.basename(trace[depth || 2].getFileName());
	const lineNumber = trace[depth || 2].getLineNumber();
	
	return colors[level].line(['(', fileName, ':', lineNumber, ')'].join(''));
}

function log(level, lineNumber, argsObject) {
	let message = [];
	const messageParts = Array.prototype.slice.call(argsObject);

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
		const args = Array.prototype.slice.call(arguments);
		const error = args[0];
		
		if (error instanceof LogError) {			
			log('ERROR', error.line, error.parts);
		} else if (error instanceof Error) {		
			log('ERROR', null, [error.stack || error.message]);				
		} else {
			log('ERROR', getLineNumber('ERROR'), arguments);
		}
	},
	setDebug: function(enabled) {
		debug = enabled;
	},
};
