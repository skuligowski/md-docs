var joinUrl = require('url-join'),
	path = require('path');

module.exports = function(documentDir) {
	var images = [];

	return {
		addImage: function(href) {
			var isRelative = href.indexOf('http') === -1 && href.indexOf('/') !== 0;

			if (isRelative) {			
				images.push(href);
			} 			
			return joinUrl(documentDir, 'images', path.basename(href));
		},
		getImages: function() {
			return images;
		}
	}
}