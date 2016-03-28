'use strict';

var fs = require('fs'),
	assert = require('assert'),
	contentParser = require('./../lib/content-parser');

it('should read meta object', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/valid-meta.md').toString('utf-8'),
		file = contentParser(fileContent);
		assert.deepEqual({ title: 'c1', url: 'c2', bookmarks: [ 'a', 'b' ] }, file.meta);
	cb();	
});
it('should return meta null', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/invalid-meta1.md').toString('utf-8'),
		file = contentParser(fileContent);
		assert.deepEqual(null, file.meta);
	cb();	
});
it('should return meta null', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/invalid-meta2.md').toString('utf-8'),
		file = contentParser(fileContent);
		assert.deepEqual(null, file.meta);
	cb();	
});
it('should return meta null', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/invalid-meta3.md').toString('utf-8'),
		file = contentParser(fileContent);
		assert.deepEqual(null, file.meta);
	cb();	
});