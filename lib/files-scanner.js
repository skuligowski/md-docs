var gs = require('glob-stream');
var bookshelf = require('./bookshelf');
var fs = require('fs');
var fse = require('fs-extra')
var q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var joinUrl = require('url-join');

var readFile = q.denodeify(fs.readFile),
	writeFile = q.denodeify(fs.writeFile),
	mkdir = q.denodeify(mkdirp),
	copy = q.denodeify(fse.copy);

function scan(srcPatterns, destDir, callback) {
	var b = bookshelf();

	var stream = gs.create(srcPatterns, {});

	var addChapterPromises = [];

	function setDestFileData(chapter) {
		var baseFile = path.basename(chapter.meta.fileUrl);
		
		chapter.destDir = path.join(destDir, chapter.meta.bookRef, chapter.meta.ref);
		chapter.destPath = path.join(chapter.destDir, baseFile);

		return chapter;
	}

	function renderChapter(chapter) {
		return mkdir(chapter.destDir)
		.then(function() {
			return writeFile(chapter.destPath, chapter.html)
			.then(function() {
				return chapter;
			});
		});		
	}

	function copyImages(chapter) {
		var copyImagePromises = _.map(chapter.images, function(href) {
			var chapterDir = path.dirname(chapter.path),
				srcImagePath = path.join(chapterDir, href),
				targetPath = path.join(chapter.destDir, 'images', path.basename(href)),
				targetDir = path.dirname(targetPath);

			return mkdir(targetDir)
			.then(function() {
				return copy(srcImagePath, targetPath);
			});
		});
		return q.all(copyImagePromises);
	}

	function writeMeta(filename) {
		var meta = JSON.stringify(_.values(b.get()), null, 4);
		return writeFile(path.join(destDir, 'books.json'), meta);
	}

	stream.on('data', function(file) {
		var promise = b.addChapter(file.path)
		.then(setDestFileData)
		.then(renderChapter)
		.then(copyImages)
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