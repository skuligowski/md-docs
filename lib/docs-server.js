var express = require('express'),
	http = require('http'),
	compress = require('compression')(),
	fs = require('fs'),
	log = require('./logger');


function startServer(options) {
	var app = express();
	var paths = options.themePaths;

	app.engine('html', function(filePath, options, callback) {
		fs.readFile(filePath, function (err, content) {
			if (err) throw new Error(err);
			return callback(null, content.toString(), options);
		});
	});
	app.set('view engine', 'html');
	app.set('views', paths);

	app.use(compress);
	for(var i = 0; i < paths.length; i++) {
		app.use('/', express.static(paths[i]));	
	}
	app.use('/docs', express.static(options.docsSrc));
	app.get(['/*'], function(req, res) {
		res.render('index.html', {});
	});

	var server = http.createServer(app);
	server.listen(options.port);
	log.info('Docs server listening on port', log.colors.green(options.port));
}

module.exports = {
	start: startServer
}; 


