'use strict';
var docs = require('./index');
docs.start('test/**/*.md', {
	debug: true,
	port: 8000,
	watch: true
});