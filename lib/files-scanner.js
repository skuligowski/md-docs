var gs = require('glob-stream');
var bookshelf = require('./bookshelf');
var fs = require('fs');
var fse = require('fs-extra')
var q = require('q');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var joinUrl = require('url-join');
var chokidar = require('chokidar');

var readFile = q.denodeify(fs.readFile),
	writeFile = q.denodeify(fs.writeFile),
	mkdir = q.denodeify(mkdirp),
	copy = q.denodeify(fse.copy);

function scan(srcPatterns, destDir, callback) {
	var b = bookshelf();
	

	function batch(watcher, cb) {

		var timeout = null,
			events = emptyEvents();

		function emptyEvents() {
			return {
				unlinked: [],
				added: [],
				changed: []
			};
		}

		function flush() {
			console.log('flush');
			var eventsToSend = events;
			events = emptyEvents();
			timeout = null;
			cb(eventsToSend.added, eventsToSend.changed, eventsToSend.unlinked);
		}

		function setFlushTimeout() {
			console.log('set flush timeout');
			timeout = setTimeout(flush, 100);
		}

		function createAggregateFn(type) {
			return function(path) {
				if (!timeout) {
					setFlushTimeout();
				}
				events[type].push(path);
			}
		}

		watcher.on('add', createAggregateFn('added'));
		watcher.on('change', createAggregateFn('changed'));
		watcher.on('unlink', createAggregateFn('unlinked'));
	}

	var watcher = chokidar.watch(srcPatterns, {ignored: /[\/\\]\./});

	batch(watcher, function(added, changed, unlinked) {
		var jobs = [];

		for(var i = 0; i < unlinked.length; i++) {
			b.deleteChapter(unlinked[i]);
		}

		for(var j = 0; j < changed.length; j++) {
			jobs.push(b.updateChapter(changed[j]).then(handleResources));
		}

		for(var k = 0; k < added.length; k++) {
			jobs.push(b.addChapter(added[k]).then(handleResources));
		}

		q.allSettled(jobs)
		.then(writeMeta)
		.then(function() {

		})
		.catch(function(err) {
			console.log(err);
		});
	});

	watcher.on('ready', callback);

	function setDestFileData(chapter) {
		var baseFile = path.basename(chapter.meta.fileUrl);
		
		chapter.destDir = path.join(destDir, chapter.meta.bookRef, chapter.meta.ref);
		chapter.destPath = path.join(chapter.destDir, baseFile);

		return q.fcall(function() {
			return chapter;
		});
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

	function writeMeta() {
		console.log('write')
		var meta = JSON.stringify(_.values(b.get()), null, 4);
		return writeFile(path.join(destDir, 'books.json'), meta);
	}

	function handleResources(chapter) {
		return setDestFileData(chapter)
		.then(renderChapter)
		.then(copyImages);
	}
}

module.exports = {
	scan: scan
}