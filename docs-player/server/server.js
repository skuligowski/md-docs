var express = require('express'),
	http = require('http'),
	compress = require('compression')(),
	path = require('path'),
	fs = require('fs');

var app = express(),
	srcDir = '../dist';

app.engine('html', function(filePath, options, callback) {
	fs.readFile(filePath, function (err, content) {
		if (err) throw new Error(err);
		return callback(null, content.toString(), options);
	});
});
app.set('view engine', 'html');
app.set('views', path.join(__dirname, srcDir));

app.use(compress);
app.use('/js', express.static(path.join(__dirname, srcDir, 'js')));
app.use('/css', express.static(path.join(__dirname, srcDir, 'css')));
app.use('/img', express.static(path.join(__dirname, srcDir, 'img')));
app.use('/docs', express.static(path.join(__dirname, srcDir, 'docs')));
app.use('/font', express.static(path.join(__dirname, srcDir, 'font')));
app.use('/vendor', express.static(path.join(__dirname, srcDir, 'vendor')));

app.get(['/tpl/*'], function(req, res) {
	var errorMessage = 'ERROR: ' + req.url + ' template is not declared index.html';
	console.log(errorMessage);
	return res.send('<div style="font-size:24px;color: #000;font-weight: bold;">' + errorMessage + '</div>');
});
app.get(['/*'], function(req, res) {
	console.log(req.path)
	res.render('index.html', {});
});



var server = http.createServer(app);
server.listen(8000);
console.log('Express server listening on port 8000');
