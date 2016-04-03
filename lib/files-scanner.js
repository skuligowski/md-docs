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
				return _.assign(file, b.add(content));
			});
	}

	function renderChapter(file) {
		var baseFile = path.basename(file.path).replace('md', 'html'),
			outDir = path.join(destDir, file.bookId, file.id);

		return mkdir(path.resolve(outDir))
		.then(function() {
			return writeFile(path.join(outDir, baseFile), file.html);
		});		
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
		.then(function(result) {
			console.log(b.get());
			callback();
		});
		
	});
}

module.exports = {
	scan: scan
}