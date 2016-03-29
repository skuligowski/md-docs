var	slug = require('slug');

module.exports = function() {
	var refsCache = {};
	
	function slugify(value) {
		return slug(value, {
			replacement: '-',
			symbols: true,
			remove: /[.,]/g,
			lower: true,
			charmap: slug.charmap,
			multicharmap: slug.multicharmap
		});
	}

	function unique(value, namespace) {
		var refBase = slugify(value);

		var namespace = namespace || 'default',
			cachedRefsGroup = refsCache[namespace],
			cachedRef;

		if (!cachedRefsGroup) {
			cachedRefsGroup = refsCache[namespace] = {};
		}

		var uniqueRef = refBase, refCount = 1;
		while(cachedRef = cachedRefsGroup[uniqueRef]) {
			uniqueRef = refBase + '-' + refCount++; 
		}
		cachedRefsGroup[uniqueRef] = true;

		return uniqueRef;
	}

	return {
		create: slugify,
		unique: unique
	}
}