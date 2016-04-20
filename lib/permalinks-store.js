var log = require('./logger');

module.exports = function() {
	var permalinksCache = {};
	
	function create(permalink, bookRef, chapterRef) {
		var uniquePermalink = '/' + bookRef + '/' + chapterRef,
			chapterPermalink = permalink || uniquePermalink,
			permalinkRef = permalinksCache[chapterPermalink];

		if (permalinkRef) {
			log.warn(log.colors.green(chapterPermalink), 'permalink is already defined, taking', log.colors.green(uniquePermalink));
			chapterPermalink = uniquePermalink;
		}

		permalinksCache[chapterPermalink] = uniquePermalink;
		return chapterPermalink;
	}

	function unlink(permalink) {
		var permalinkRef = permalinksCache[permalink];
		if (permalinkRef) {
			log.debug('Unlinking', log.colors.green(permalink), 'permalink');
			delete permalinksCache[permalink];
		}
	}

	return {
		create: create,
		unlink: unlink
	}
}