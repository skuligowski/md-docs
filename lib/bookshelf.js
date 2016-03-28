var fs = require('fs'),
	contentParser = require('./content-parser'),
	createRef = require('./ref-factory').create;

module.exports = function() {

	var bookshelf = {};

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

			var bookRef = createRef(meta.book);

			var book = bookshelf[bookRef];
			if (!book) {
				book = bookshelf[bookRef] = {
					id: bookRef,
					title: meta.book,
					chapters: []
				};
			}

			var chapterRef = createRef(meta.chapter);

			console.log(chapterRef)
		}
	}
}