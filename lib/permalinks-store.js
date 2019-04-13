const log = require('./logger');

module.exports = () => {
	const permalinksCache = {};
	
	function create(permalink, bookRef, chapterRef) {
		const uniquePermalink = '/' + bookRef + '/' + chapterRef;
		let chapterPermalink = permalink || uniquePermalink;
		const permalinkRef = permalinksCache[chapterPermalink];

		if (permalinkRef) {
			log.warn(log.colors.green(chapterPermalink), 'permalink is already defined, taking', log.colors.green(uniquePermalink));
			chapterPermalink = uniquePermalink;
		}

		permalinksCache[chapterPermalink] = uniquePermalink;
		return chapterPermalink;
	}

	function unlink(permalink) {
		const permalinkRef = permalinksCache[permalink];
		if (permalinkRef) {
			log.debug('Unlinking', log.colors.green(permalink), 'permalink');
			delete permalinksCache[permalink];
		}
	}

	return {
		create: create,
		unlink: unlink,
	};
}
