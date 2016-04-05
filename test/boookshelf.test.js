'use strict';

var fs = require('fs'),
	assert = require('assert'),
	path = require('path'),
	bookshelf = require('./../lib/bookshelf');

function readFile(filename) {
	var filePath = path.resolve(filename);
	return fs.readFileSync(filePath).toString('utf-8');
}

it('should add chapter to the book', function (cb) {		
	var b = bookshelf();
	b.addChapter(path.resolve('test/fixtures/source/test1.md'));
	b.addChapter(path.resolve('test/fixtures/source/test2.md'));
	b.addChapter(path.resolve('test/fixtures/source/test1.md'));
	cb();	
});
