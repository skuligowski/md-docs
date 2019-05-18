'use strict';

const path = require('path');
const bookshelf = require('./../lib/bookshelf');
const q = require('q');

it('should add chapter to the book', function () {		
	const b = bookshelf();
	return q.allSettled([
		b.addChapter(path.resolve('test/fixtures/source/test1.md')),
		b.addChapter(path.resolve('test/fixtures/source/test2.md')),
		b.addChapter(path.resolve('test/fixtures/source/test1.md')),
	]);
});
