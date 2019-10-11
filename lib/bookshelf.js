const fse = require('fs-extra');
const contentParser = require('./content-parser');
const createRefsStore = require('./refs-store');
const createPermalinksStore = require('./permalinks-store');
const bookmarksBuilder = require('./bookmarks-builder');
const resourcesCapturer = require('./resources-capturer');
const chapterRenderer = require('./chapter-renderer');
const path = require('path');
const log = require('./logger');
const joinUrl = require('url-join');

const readFile = fse.readFile;

module.exports = () => {

	const bookshelf = {};
	const chapterFiles = {};
	const permalinks = createPermalinksStore();
	const refsStore = createRefsStore();

	function parseFile(filePath, encoding) {
		log.debug('Parsing file:', log.colors.green(filePath));
		return readFile(filePath, encoding || 'utf8')
			.then(content => {
				return Object.assign({
					path: filePath,
				}, contentParser(content, filePath));
			});
	}

	function getBook(bookTitle) {
		const bookRef = refsStore.create(bookTitle);
		let book = bookshelf[bookRef];
		
		if (!book) {
			book = bookshelf[bookRef] = {
				ref: bookRef,
				title: bookTitle,
				chapters: [],
			};
		}

		return book;
	}

	function getFileUrl(filePath, bookRef, chapterRef) {
		const basename = path.basename(filePath).replace('md', 'html');
		return joinUrl('docs', bookRef, chapterRef, basename);
	}

	function prepareChapter(file, bookRef) {
		const chapterRef = refsStore.unique(file.chapter, bookRef);
			
		if (!chapterRef) {
			throw new log.Error('Chapter title of', log.colors.green(file.path), 'is not unique');
		}

		const chapterMeta = {
			ref: chapterRef,
			bookRef: bookRef,
			title: file.chapter,
			order: file.order,
			default: !!file.default,
			permalink: permalinks.create(file.permalink, bookRef, chapterRef),
			fileUrl: getFileUrl(file.path, bookRef, chapterRef),
		};

		const bookmarks = bookmarksBuilder();
		const resources = resourcesCapturer(path.dirname(chapterMeta.fileUrl));
		const chapterHtml = chapterRenderer.render(file.content, bookmarks, resources);
		
		chapterMeta.bookmarks = bookmarks.get();

		return {
			path: file.path,
			meta: chapterMeta,
			html: chapterHtml,
			images: resources.getImages(),
		};
	}

	function updateChapter(filePath, encoding) {
		return parseFile(filePath, encoding).then(file => {
			const book = getBook(file.book);
			const bookRef = book.ref;
			
			const chapter = chapterFiles[filePath];
			if (!chapter) {
				return addChapter(filePath, encoding);
			}

			if (chapter.bookRef !== bookRef) {
				deleteChapter(filePath);
				return addChapter(filePath, encoding);
			}
			permalinks.unlink(chapter.permalink);
			refsStore.unlinkRef(chapter.ref, bookRef);

			const chapterDoc = prepareChapter(file, bookRef);
			Object.assign(chapter, chapterDoc.meta);
			return chapterDoc;
		});
	}

	function addChapter(filePath, encoding) {
		return parseFile(filePath, encoding).then(file => {
			const book = getBook(file.book);
			const bookRef = book.ref;
			const chapterDoc = prepareChapter(file, bookRef);
				
			book.chapters.push(chapterDoc.meta);
			chapterFiles[filePath] = chapterDoc.meta;
			return chapterDoc;
		});
	}

	function deleteChapter(filePath) {
		const chapter = chapterFiles[filePath];
		if (chapter) {
			const book = bookshelf[chapter.bookRef];
			const chapters = book.chapters;
			
			const index = chapters.indexOf(chapter);
			if (index > -1) {
				refsStore.unlinkRef(chapter.ref, chapter.bookRef);
				permalinks.unlink(chapter.permalink);
				chapters.splice(index, 1);
				delete chapterFiles[filePath];
				if (chapters.length === 0) {
					delete bookshelf[chapter.bookRef];
				}
			}
		}
	} 

	return {
		addChapter: addChapter,
		updateChapter: updateChapter,
		deleteChapter: deleteChapter,
		get: () => bookshelf,
	};
};
