'use strict';

const fs = require('fs');
const assert = require('assert');
const contentParser = require('./../lib/content-parser');

it('should read meta object', function (cb) {		
	const fileContent = fs.readFileSync('test/fixtures/source/valid-meta.md').toString('utf-8'),
		file = contentParser(fileContent);
		assert.deepEqual({ book: 'b1', permalink: '/u1', chapter: 'c1', content: '\n\n## An h1 header\n' }, file);
	cb();	
});
it('should return exception 1', function (cb) {		
	const fileContent = fs.readFileSync('test/fixtures/source/invalid-meta1.md').toString('utf-8');
		assert.throws(function() {
			contentParser(fileContent);
		});
	cb();	
});
it('should return exception 2', function (cb) {		
	const fileContent = fs.readFileSync('test/fixtures/source/invalid-meta2.md').toString('utf-8');
		assert.throws(function() {
			contentParser(fileContent);
		});
	cb();	
});
it('should return exception 3', function (cb) {		
	const fileContent = fs.readFileSync('test/fixtures/source/invalid-meta3.md').toString('utf-8');
		assert.throws(function() {
			contentParser(fileContent);
		});
	cb();	
});
