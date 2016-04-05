var fs = require('fs'),
	contentParser = require('./content-parser'),
	createRefsStore = require('./refs-store'),
	createPermalinksStore = require('./permalinks-store'),
	bookmarksBuilder = require('./bookmarks-builder'),
	resourcesCapturer = require('./resources-capturer'),
	chapterRenderer = require('./chapter-renderer'),
	path = require('path'),
	joinUrl = require('url-join');

var q = require('q'),
	readFile = q.denodeify(fs.readFile);

module.exports = function() {

	var bookshelf = {},
		permalinks = createPermalinksStore(),
		refsStore = createRefsStore();

	function getBook(meta) {
		var bookRef = refsStore.create(meta.book),
			book = bookshelf[bookRef];
		
		if (!book) {
			book = bookshelf[bookRef] = {
				ref: bookRef,
				title: meta.book,
				chapters: []
			};
		}

		return book;
	}

	function getFileUrl(filePath, bookRef, chapterRef) {
		var basename = path.basename(filePath).replace('md', 'html');
		return joinUrl('/docs', bookRef, chapterRef, basename); 
	}

	return {
		addChapter: function(filePath, encoding) {
			return readFile(filePath, encoding || 'utf8')
			.then(function(content) {
				var parsedFile = contentParser(content),
					fileMeta = parsedFile.meta,
					book = getBook(fileMeta);
					
				var bookRef = book.ref,
					chapterRef = refsStore.unique(fileMeta.chapter, bookRef);
				
				var chapter = {
					ref: chapterRef,
					bookRef: bookRef,
					title: fileMeta.chapter,
					permalink: permalinks.create(fileMeta.permalink, bookRef, chapterRef),
					fileUrl: getFileUrl(filePath, bookRef, chapterRef)
				};

				var bookmarks = bookmarksBuilder(),
					resources = resourcesCapturer(path.dirname(chapter.fileUrl));

				var chapterHtml = chapterRenderer.render(parsedFile.content, bookmarks, resources);
				
				chapter.bookmarks = bookmarks.get();
				book.chapters.push(chapter);	
				
				return {
					path: filePath,
					meta: chapter,
					html: chapterHtml,
					images: resources.getImages()
				};
			});
		},
		get: function() {
			return bookshelf;
		}
	};
};