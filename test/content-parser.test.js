'use strict';

var fs = require('fs'),
	assert = require('assert'),
	contentParser = require('./../lib/content-parser');

it('should read meta object', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/valid-meta.md').toString('utf-8'),
		file = contentParser(fileContent);
		assert.deepEqual({ book: 'b1', permalink: '/u1', chapter: 'c1' }, file.meta);
	cb();	
});
it('should return exception 1', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/invalid-meta1.md').toString('utf-8');
		assert.throws(function() {
			contentParser(fileContent);
		});
	cb();	
});
it('should return exception 2', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/invalid-meta2.md').toString('utf-8');
		assert.throws(function() {
			contentParser(fileContent);
		});
	cb();	
});
it('should return exception 3', function (cb) {		
	var fileContent = fs.readFileSync('test/fixtures/source/invalid-meta3.md').toString('utf-8');
		assert.throws(function() {
			contentParser(fileContent);
		});
	cb();	
});