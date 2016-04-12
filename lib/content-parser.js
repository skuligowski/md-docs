var	yamljs = require('yamljs');

function parseYaml(yamlContent) {
	try {
		return yamljs.parse(yamlContent);
	} catch(e) {
		return null;
	}
}

function validateMeta(meta) {
	if (!meta.book) {
		throw new Error('Undefined book property');
	}
}

module.exports = function(content) {
	
	var metaRegExp = /^---([\s\S]*?)^---/mg,
		file, match;
		
	if (match = metaRegExp.exec(content)) {
		var yamlContent = match[1];
		file = parseYaml(yamlContent) || {};
		file.content = content.replace(match[0], '');
	}
	
	validateMeta(file);

	return file;
}