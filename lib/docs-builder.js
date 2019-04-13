const bookshelf = require('./bookshelf');
const fs = require('fs');
const fse = require('fs-extra');
const q = require('q');
const path = require('path');
const mkdirp = require('mkdirp');
const log = require('./logger');
const chokidar = require('chokidar');
const batch = require('./events-batch');
const sorterFn = require('./sorter')('order', 'title');

const writeFile = q.denodeify(fs.writeFile);
const mkdir = q.denodeify(mkdirp);
const copy = q.denodeify(fse.copy);

function createNotifyReadyFn(cb) {
	let callbackFired = false;
	let enabled = false;

	const fn = () => {
		if (enabled && !callbackFired) {
			callbackFired = true;
			cb();
		}
	};
	fn.enable = () => {
		enabled = true;
	};
	return fn;
}

function build(srcPatterns, destDir, options, callback) {
	const b = bookshelf();
	const isWatching = options.watch || false;
	const watcher = chokidar.watch(srcPatterns, {ignored: options.ignored});
	const notifyReady = createNotifyReadyFn(() => {
			if (!isWatching) {
				watcher.close();
			} else {
				log.info('Watching changes of', log.colors.green(srcPatterns), 'files');
			}
			callback();
		});

	batch(watcher, (added, changed, unlinked) => {
		const jobs = [];

		function addJob(file, promise) {
			jobs.push(promise.catch(log.error));
		}

		for(let i = 0; i < unlinked.length; i++) {
			b.deleteChapter(unlinked[i]);
		}

		for(let j = 0; j < changed.length; j++) {
			addJob(changed[j], b.updateChapter(changed[j]).then(handleResources));
		}

		for(let k = 0; k < added.length; k++) {
			addJob(added[k], b.addChapter(added[k]).then(handleResources));
		}

		q.allSettled(jobs)
		.then(writeMeta)
		.then(notifyReady)
		.catch(log.error);
	});

	watcher.on('ready', notifyReady.enable);

	function setDestFileData(chapter) {
		const baseFile = path.basename(chapter.meta.fileUrl);
		
		chapter.destDir = path.join(destDir, chapter.meta.bookRef, chapter.meta.ref);
		chapter.destPath = path.join(chapter.destDir, baseFile);

		return q.fcall(() => chapter);
	}

	function renderChapter(chapter) {
		return mkdir(chapter.destDir)
			.then(() => writeFile(chapter.destPath, chapter.html))
			.then(() => chapter);
	}

	function copyImages(chapter) {
		const copyImagePromises = chapter.images.map(href => {
			const chapterDir = path.dirname(chapter.path);
			const srcImagePath = path.join(chapterDir, href);
			const targetPath = path.join(chapter.destDir, 'images', path.basename(href));
			const targetDir = path.dirname(targetPath);

			return mkdir(targetDir).then(() => copy(srcImagePath, targetPath));
		});
		return q.all(copyImagePromises);
	}

	function writeMeta() {
		const meta = Object.values(b.get());
		
		for(let i = 0; i < meta.length; i++) {
			meta[i].chapters.sort(sorterFn);
		}
		meta.sort(sorterFn);

		const metaJson = JSON.stringify(meta, null, 4);
		log.info('Writing', log.colors.green('books.json'));
		return writeFile(path.join(destDir, 'books.json'), metaJson);
	}

	function handleResources(chapter) {
		return setDestFileData(chapter)
			.then(renderChapter)
			.then(copyImages);
	}
}

module.exports = {
	build
}
