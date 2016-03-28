var fs = require('fs'),
	contentParser = require('./content-parser');

module.exports = function() {

	var bookshelf = {};

	return {
		add: function(filename) {
			var fileContent = fs.readFileSync(filename).toString('utf-8'),
				parsedFile = contentParser(fileContent);

			if (!parsedFile.meta) {
				console.log('Meta data for file is not found');
			}
		}
	}
}