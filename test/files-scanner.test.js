'use strict';

var fs = require('fs'),
	assert = require('assert'),
	filesScanner = require('./../lib/files-scanner');

it('should find all files', function (cb) {		
	filesScanner.scan('test/**/*.md', 'test/fixtures/rendered', cb);
});
