const joinUrl = require('url-join');
const path = require('path');

module.exports = documentDir => {
	const images = [];

	return {
		addImage: href => {
			const isRelative = href.indexOf('http') === -1 && href.indexOf('/') !== 0;

			if (isRelative) {
				images.push(href);
			}
			return joinUrl(documentDir, 'images', path.basename(href));
		},
		getImages: () => images
	};
};
