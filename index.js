var logger = require('./lib/logger');

function createTempOutputDir() {
	var temp = require('temp').track(),
		tempDir = temp.mkdirSync('docsplayer');

	process.on('SIGINT', function() {
		temp.cleanupSync();			
		process.exit();
	});

	return tempDir;
}

function startDocs(docsSrcPattern, opts) {
	var docsServer = require('./lib/docs-server'),
		docsBuilder = require('./lib/docs-builder'),
		options = opts || {},
		docsDestDir = options.docsDestDir || createTempOutputDir();

	logger.setDebug(options.debug || false);
	var builderOptions = {
		watch: options.watch || false
	};
	docsBuilder.build(docsSrcPattern, docsDestDir, builderOptions, function() {
		docsServer.start({
			playerSrc: 'player/dist',
			docsSrc: docsDestDir,
			port: options.port || 8000
		});		
	});
}

module.exports = {
	start: startDocs
};