var fs = require('fs'),
	contentParser = require('./content-parser'),
	createRefsStore = require('./refs-store'),
	path = require('path');

module.exports = function() {

	var bookshelf = {},
		uniqueUrls = {},
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
			
			var fileRef = book.files[filePath];
			if (fileRef) {
				console.log(filePath + ' file is already in the book for chapter: ' + fileRef);
				return;
			}
			var chapterRef = refsStore.unique(meta.chapter, bookRef),
				chapterUrl = meta.url || '/' + bookRef + '/' + chapterRef;

			var urlRef = uniqueUrls[chapterUrl];
			if (urlRef) {
				console.log(chapterUrl + ' url is already defined for book: ' + urlRef.book + ', chapter: ' + urlRef.chapter);
				chapterUrl = '/' + bookRef + '/' + chapterRef;
			}

			book.files[filePath] = chapterRef;
			uniqueUrls[chapterUrl] = {
				book: bookRef,
				chapter: chapterRef
			};
			book.chapters.push({
				id: chapterRef,
				title: meta.chapter,
				url: chapterUrl,
				bookmarks: []
			});
			console.log(bookshelf[bookRef])
		}
	}
}