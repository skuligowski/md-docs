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

	function getCachedRefsGroup(namespace) {
		var namespace = namespace || 'default',
			cachedRefsGroup = refsCache[namespace];

		if (!cachedRefsGroup) {
			cachedRefsGroup = refsCache[namespace] = {};
		}

		return cachedRefsGroup;
	}

	function unique(value, namespace) {
		var refBase = slugify(value),
			cachedRefsGroup = getCachedRefsGroup(namespace);

		if (cachedRefsGroup[refBase])
			return;

		cachedRefsGroup[refBase] = true;

		return refBase;
	}

	function nextUnique(value, namespace) {
		var refBase = slugify(value),
			cachedRefsGroup = getCachedRefsGroup(namespace),
			cachedRef;

		var uniqueRef = refBase, refCount = 2;
		while(cachedRef = cachedRefsGroup[uniqueRef]) {
			uniqueRef = refBase + '-' + refCount++; 
		}
		cachedRefsGroup[uniqueRef] = true;

		return uniqueRef;
	}

	function unlinkRef(value, namespace) {
		console.log(value, namespace);
		console.log(refsCache)
		var cachedRefsGroup = refsCache[namespace];
		if (cachedRefsGroup) {
			console.log('unlinked');
			delete cachedRefsGroup[value];
		}
	}

	return {
		create: slugify,
		unique: unique,
		nextUnique: nextUnique,
		unlinkRef: unlinkRef
	}
}