var gs = require('glob-stream');
var bookshelf = require('./bookshelf');
var fs = require('fs');
var q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');

var readFile = q.denodeify(fs.readFile),
	writeFile = q.denodeify(fs.writeFile),
	mkdir = q.denodeify(mkdirp);

function scan(srcPatterns, destDir, callback) {
	var b = bookshelf();

	var stream = gs.create(srcPatterns, {});

	var addChapterPromises = [];

	function addChapter(file) {
		return readFile(file.path, file.encoding)
			.then(function(content) {
				var chapter = b.add(content);
				chapter.file = file;
				return chapter;
			});
	}

	function renderChapter(chapter) {
		var baseFile = path.basename(chapter.file.path).replace('md', 'html'),
			outDir = path.join(destDir, chapter.meta.bookId, chapter.meta.id);

		return mkdir(outDir)
		.then(function() {
			return writeFile(path.join(outDir, baseFile), chapter.html);
		});		
	}

	function writeMeta(filename) {
		return writeFile(path.join(destDir, 'books.json'), JSON.stringify(b.get(), null, 4));
	}

	stream.on('data', function(file) {
		file.encoding = 'utf-8';
		
		var promise = addChapter(file)
		.then(renderChapter)
		.catch(function(err) {
			console.log(err);
		});

		addChapterPromises.push(promise);
	});

	stream.on('end', function() {
		q.all(addChapterPromises)
		.then(writeMeta)
		.then(callback);
	});
}

module.exports = {
	scan: scan
}