var fs = require('fs'),
	contentParser = require('./content-parser'),
	createRefsStore = require('./refs-store'),
	path = require('path');

module.exports = function() {

	var bookshelf = {},
		refsStore = createRefsStore();

	return {
		add: function(filename) {
			var filePath = path.resolve(filename),
				fileContent = fs.readFileSync(filePath).toString('utf-8'),
				parsedFile = contentParser(fileContent),
				meta = parsedFile.meta;

			if (!meta) {
				console.log('Meta data for file is not found');
				return;
			}

			if (!meta.book) {
				console.log('Undefined book property')
				return;
			}

			var bookRef = refsStore.create(meta.book);
			var book = bookshelf[bookRef];
			if (!book) {
				book = bookshelf[bookRef] = {
					id: bookRef,
					title: meta.book,
					chapters: [],
					files: {}
				};
			}
			
			var chapterRef = book.files[filePath];
			if (chapterRef) {
				console.log(filePath + ' file is already in the book as ref: ' + chapterRef);
				return;
			}
			chapterRef = refsStore.unique(meta.chapter, bookRef);
			book.files[filePath] = chapterRef;
			book.chapters.push({
				id: chapterRef,
				title: meta.chapter
			});
			console.log(bookshelf['markdown-readme'])
		}
	}
}