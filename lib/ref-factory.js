var	slug = require('slug');

function create(value) {
	return slug(value, {
		replacement: '-',
		symbols: true,
		remove: /[.,]/g,
		lower: true,
		charmap: slug.charmap,
		multicharmap: slug.multicharmap
	});
}

module.exports = {
	create: create
}