'use strict';

var fs = require('fs'),
	assert = require('assert'),
	path = require('path'),
	bookshelf = require('./../lib/bookshelf'),
	q = require('q');

it('should add chapter to the book', function () {		
	var b = bookshelf();
	return q.allSettled([
		b.addChapter(path.resolve('test/fixtures/source/test1.md')),
		b.addChapter(path.resolve('test/fixtures/source/test2.md')),
		b.addChapter(path.resolve('test/fixtures/source/test1.md')),
	]);
});
