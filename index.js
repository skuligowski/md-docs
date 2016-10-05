var log = require('./lib/logger');
var path = require('path');
var _ = require('lodash');

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
		theme: opts.theme || 'default',
		watch: opts.watch || false,
	};
	
	var docsServer = require('./lib/docs-server');
	var docsBuilder = require('./lib/docs-builder');
	var docsThemes = require('./lib/docs-themes');

	log.setDebug(options.debug || false);
	docsBuilder.build(options.src, options.docsDestDir, options, function() {
		
		var themesStack = docsThemes.readThemesStack(options.theme);
		var themePaths = _(themesStack).map('path').value();

		docsServer.start({
			themePaths: themePaths,		
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
