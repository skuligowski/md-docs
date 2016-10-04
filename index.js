var log = require('./lib/logger');
var path = require('path');

function createTempOutputDir() {
	var temp = require('temp').track();
	var tempDir = temp.mkdirSync('docsplayer');

	process.on('SIGINT', function() {
		temp.cleanupSync();			
		process.exit();
	});

	return tempDir;
}

function startDocs(src, opts) {

	opts = opts || {};
	
	var options = {
		port: opts.port || 8000,
		debug: opts.debug || false,
		ignored: opts.ignored || /([\/\\]\.|node_modules)/,
		src: src || path.join(process.cwd(), '**/*.md'),
		docsDestDir: opts.docsDestDir || createTempOutputDir(),
		watch: opts.watch || false,
	};
	
	var docsServer = require('./lib/docs-server');
	var docsBuilder = require('./lib/docs-builder');	

	log.setDebug(options.debug || false);
	docsBuilder.build(options.src, options.docsDestDir, options, function() {
		docsServer.start({
			playerSrc: path.join(__dirname, 'player'),
			docsSrc: options.docsDestDir,
			port: options.port || 8000
		});		
	});
}

function createTheme(themeName) {
	log.info('Creating theme ... ' + themeName);
}

function runCli() {
	var argv = require('yargs').argv;
	
	if (argv.createTheme) {
		return createTheme(argv.createTheme);
	}	

	startDocs(argv.src, argv);
}

module.exports = {
	start: startDocs,
	cli: runCli
};
