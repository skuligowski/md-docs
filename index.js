var marked = require('marked'),
	fs = require('fs');

var file = marked(fs.readFileSync('test.md').toString('utf-8'));
console.log(file);