const slug = require('slug');
const log = require('./logger');

module.exports = () => {
	const refsCache = {};
	
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
		const ns = namespace || 'default';
		let cachedRefsGroup = refsCache[ns];

		if (!cachedRefsGroup) {
			cachedRefsGroup = refsCache[ns] = {};
		}

		return cachedRefsGroup;
	}

	function unique(value, namespace) {
		const refBase = slugify(value);
		const cachedRefsGroup = getCachedRefsGroup(namespace);

		if (cachedRefsGroup[refBase]) {
			log.debug(log.colors.green(refBase), 'ref in', log.colors.green(namespace), 'namespace already exists!');
			return;
		}

		cachedRefsGroup[refBase] = true;

		return refBase;
	}

	function nextUnique(value, namespace) {
		const refBase = slugify(value);
		const cachedRefsGroup = getCachedRefsGroup(namespace);
		let cachedRef;
		let uniqueRef = refBase, refCount = 2;

		while(cachedRef = cachedRefsGroup[uniqueRef]) {
			uniqueRef = refBase + '-' + refCount++; 
		}
		cachedRefsGroup[uniqueRef] = true;

		return uniqueRef;
	}

	function unlinkRef(value, namespace) {
		const cachedRefsGroup = refsCache[namespace];
		if (cachedRefsGroup) {
			log.debug('Unlinking', log.colors.green(value), 'ref in', log.colors.green(namespace), 'namespace');
			delete cachedRefsGroup[value];
		}
	}

	return {
		create: slugify,
		unique: unique,
		nextUnique: nextUnique,
		unlinkRef: unlinkRef,
	}
}
