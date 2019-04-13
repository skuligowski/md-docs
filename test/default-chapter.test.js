'use strict';

const assert = require('assert');
const path = require('path');
const bookshelf = require('./../lib/bookshelf');

function loadChapter(file) {
	const b = bookshelf();
	return b.addChapter(path.resolve(file))
		.then(function() {
			const book = b.get()['markdown-first'];
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
