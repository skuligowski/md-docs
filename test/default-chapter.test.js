'use strict';

var assert = require('assert');
var path = require('path');
var bookshelf = require('./../lib/bookshelf');
var q = require('q');

function loadChapter(file) {
	var b = bookshelf();
	return b.addChapter(path.resolve(file))
	.then(function() {
		var book = b.get()['markdown-first'];
		return book.chapters[0];
	});
}

describe('should mark chapter as default', function() {
	it('when default is set to true', function () {
		loadChapter('test/fixtures/source/default-chapter/default-chapter.md')
		.then(function() {
			assert.equal(true, chapter.default);
		});
	});
});

describe('should not mark chapter as default', function () {
	it('when default is set to false', function() {
		loadChapter('test/fixtures/source/default-chapter/default-chapter-false.md')
		.then(function() {
			assert.equal(false, chapter.default);
		});
	});

	it('when default is not present', function() {
		loadChapter('test/fixtures/source/default-chapter/default-chapter-missing.md')
		.then(function() {
			assert.equal(false, chapter.default);
		});
	});
});