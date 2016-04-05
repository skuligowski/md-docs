module.exports = function() {
	var permalinksCache = {};
	
	function create(permalink, bookRef, chapterRef) {
		var uniquePermalink = '/' + bookRef + '/' + chapterRef,
			chapterPermalink = permalink || uniquePermalink,
			permalinkRef = permalinksCache[chapterPermalink];

		if (permalinkRef) {
			console.log(chapterPermalink + ' permalink is already defined for: ' + permalinkRef);
			chapterPermalink = uniquePermalink;
		}

		permalinksCache[chapterPermalink] = uniquePermalink;
		return chapterPermalink;
	}

	return {
		create: create
	}
}