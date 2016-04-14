var	slug = require('slug'),
	log = require('./logger');

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

		if (cachedRefsGroup[refBase]) {
			log.debug(log.colors.green(refBase), 'ref in', log.colors.green(namespace), 'namespace already exists!');
			return;
		}

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
		var cachedRefsGroup = refsCache[namespace];
		if (cachedRefsGroup) {
			log.debug('Unlinking', log.colors.green(value), 'ref in', log.colors.green(namespace), 'namespace');
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