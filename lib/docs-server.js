function startServer(options) {
	const path = require('path');
	const express = require('express');
	const http = require('http');
	const compress = require('compression')();
	const fs = require('fs');
	const log = require('./logger');
	const app = express();
	const paths = options.themePaths;

	app.engine('html', (filePath, options, callback) => {
		fs.readFile(filePath, 'utf8', (err, content) => {
			if (err) throw new Error(err);
			content = content.replace(/\${([a-zA-Z0-9_]+)}/g, (match, name) => options[name]);
			return callback(null, content);
		});
	});
	app.set('view engine', 'html');
	app.set('views', paths);
	app.use(compress);

	const baseHref = path.posix.join('/', options.baseHref, '/');

	paths.forEach(path => app.use(baseHref, express.static(path, { index: false })));
	app.use(`${baseHref}docs`, express.static(options.docsSrc));
	app.get([`${baseHref}*`], function(req, res) {
		res.render('index.html', { baseHref: baseHref });
	});

	const server = http.createServer(app);
	server.listen(options.port);
	log.info('Docs server listening on port', log.colors.green(options.port), 'with base href', log.colors.green(baseHref));
}

module.exports = {
	start: startServer,
}; 


