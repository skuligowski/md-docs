var express = require('express'),
	http = require('http'),
	compress = require('compression')(),
	fs = require('fs'),
	log = require('./logger');


function startServer(options) {
	var app = express();

	app.engine('html', function(filePath, options, callback) {
		fs.readFile(filePath, function (err, content) {
			if (err) throw new Error(err);
			return callback(null, content.toString(), options);
		});
	});
	app.set('view engine', 'html');
	app.set('views', options.playerSrc);

	app.use(compress);
	app.use('/', express.static(options.playerSrc));
	app.use('/docs', express.static(options.docsSrc));

	app.get(['/tpl/*'], function(req, res) {
		var errorMessage = 'ERROR: ' + req.url + ' template is not declared index.html';
		console.log(errorMessage);
		return res.send('<div style="font-size:24px;color: #000;font-weight: bold;">' + errorMessage + '</div>');
	});
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


