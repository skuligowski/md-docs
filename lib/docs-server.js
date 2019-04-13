function startServer(options) {
	const express = require('express');
	const http = require('http');
	const compress = require('compression')();
	const fs = require('fs');
	const log = require('./logger');
	const app = express();
	const paths = options.themePaths;

	app.engine('html', (filePath, options, callback) => {
		fs.readFile(filePath, (err, content) => {
			if (err) throw new Error(err);
			return callback(null, content.toString(), options);
		});
	});
	app.set('view engine', 'html');
	app.set('views', paths);
	app.use(compress);

	paths.forEach(path => app.use('/', express.static(path)));
	app.use('/docs', express.static(options.docsSrc));
	app.get(['/*'], function(req, res) {
		res.render('index.html', {});
	});

	const server = http.createServer(app);
	server.listen(options.port);
	log.info('Docs server listening on port', log.colors.green(options.port));
}

module.exports = {
	start: startServer
}; 


