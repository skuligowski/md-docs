const log = require('./lib/logger');
const path = require('path');

function createTempOutputDir() {
	const temp = require('temp').track();
	const tempDir = temp.mkdirSync('docsplayer');

	process.on('SIGINT', function() {
		log.info('Stopped: cleaning temp dir');
		temp.cleanupSync();
		process.exit();
	});

	return tempDir;
}

function startDocs(src, opts) {

	opts = opts || {};
	src = typeof src === 'string' ? src.split(',') : src;

	const options = {
		port: opts.port || 8000,
		debug: opts.debug || false,
		ignored: opts.ignored || /([\/\\]\.|node_modules)/,
		src: src || path.join(process.cwd(), '**/*.md'),
		docsDestDir: opts.docsDestDir || createTempOutputDir(),
		theme: opts.theme || 'default',
		watch: opts.watch || false,
	};
	
	const docsServer = require('./lib/docs-server');
	const docsBuilder = require('./lib/docs-builder');
	const docsThemes = require('./lib/docs-themes');

	log.setDebug(options.debug || false);

	docsBuilder.build(options.src, options.docsDestDir, options, () => {
		const themePaths = docsThemes.readThemePaths(options.theme);
		if (!themePaths.length) 
			return;

		log.info('Using docs theme:', log.colors.green(options.theme));

		docsServer.start({
			themePaths: themePaths,
			docsSrc: options.docsDestDir,
			port: options.port || 8000,
		});
	});
}


function runCli() {
	const argv = require('yargs')
		.string('initTheme')
		.argv;
	
	log.setDebug(argv.debug || false);

	if (argv.initTheme) {
		return require('./lib/docs-themes').initTheme(argv.initTheme === true ? null : argv.initTheme);
	}

	if (argv.listThemes) {
		return require('./lib/docs-themes').listThemes();
	}

	startDocs(argv.src, argv);
}

module.exports = {
	start: startDocs,
	cli: runCli
};
