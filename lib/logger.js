var debug = false,
	chalk = require('chalk'),
	stackTrace = require('stack-trace'),
	path = require('path');


function LogError() {
	var args = Array.prototype.slice.call(arguments);
	args.unshift(chalk.bgRed.white('ERROR'));
	this.name = this.constructor.name;
	this.message = args.join(' ');
};

require('util').inherits(LogError, Error);

function getFileWithLineNumber(color) {
	var trace = stackTrace.get(),
		fileName = path.basename(trace[2].getFileName()),
		lineNumber = trace[2].getLineNumber();
	
	return chalk[color](['(', fileName, ':', lineNumber, ')'].join(''));
}

module.exports = {
	colors: chalk,
	Error: LogError,
	info: function() {
		console.log.apply(null, arguments);
	},
	debug: function() {
		if (debug) {
			var args = Array.prototype.slice.call(arguments);
			console.log.apply(null, [chalk.bgCyan.black('DEBUG'), getFileWithLineNumber('cyan')].concat(args));	
		}
	},
	error: function() {		
		var args = Array.prototype.slice.call(arguments),
			error = args[0];
		
		if (error instanceof LogError) {
			console.log(error.message);
		} else if (error instanceof Error) {		
			if (error.stack) {
				console.log(chalk.bgRed.white('ERROR'), error.stack);
			} else {
				console.log(chalk.bgRed.white('ERROR'), error.message);
			}
		} else {
			args.unshift(chalk.bgRed.white('ERROR'))
			console.log.apply(null, args);
		}
	},
	setDebug: function(enabled) {
		debug = enabled;
	}
}