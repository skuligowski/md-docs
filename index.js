function startDocs(docsSrcPattern, docsDestDir) {
	var docsServer = require('./server'),
		filesScanner = require('./lib/files-scanner');
		
	filesScanner.scan(docsSrcPattern, docsDestDir, function() {
		docsServer.start({
			playerSrc: 'player/dist',
			docsSrc: docsDestDir,
			port: 8000
		});
	});
}

module.exports = {
	start: startDocs
}