var marked = require('marked'),
	fs = require('fs'),
	contentParser = require('./lib/content-parser');

function render(dirs) {
	var file = marked(fs.readFileSync('test.md').toString('utf-8'));
	console.log(file);
}

module.exports = function(dir) {
	var fileContent = fs.readFileSync('fixtures/source/test1.md').toString('utf-8');	
	var file = contentParser(fileContent);	
	var mdContent = marked(file.content);
	console.log(mdContent);
}