var	yamljs = require('yamljs');

function parseYaml(yamlContent) {
	try {
		return yamljs.parse(yamlContent);
	} catch(e) {
		return null;
	}
}

function validateMeta(meta) {
	if (!meta) {
		throw new Error('Meta data for file is not found')
	}

	if (!meta.book) {
		throw new Error('Undefined book property');
	}
}

module.exports = function(content) {
	
	var metaRegExp = /^---([\s\S]*?)^---/mg,
		metaObject = null,
		match;
		
	if (match = metaRegExp.exec(content)) {
		var yamlContent = match[1];
		metaObject = parseYaml(yamlContent);
		content = content.replace(match[0], ''); 
	}
	
	validateMeta(metaObject);

	return {
		meta: metaObject,
		content: content
	}
}