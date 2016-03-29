var fs = require('fs'),
	contentParser = require('./content-parser'),
	createRefsStore = require('./refs-store');

module.exports = function() {

	var bookshelf = {},
		refsStore = createRefsStore();

	return {
		add: function(filename) {
			var fileContent = fs.readFileSync(filename).toString('utf-8'),
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
					chapters: []
				};
			}

			var chapterRef = refsStore.unique(meta.chapter);
			book.chapters.push({
				id: chapterRef,
				title: meta.chapter
			});			
		}
	}
}