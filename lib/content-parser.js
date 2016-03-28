var	yamljs = require('yamljs');
var metaRegExp = /^---([\s\S]*?)^---/mg;

function parseYaml(yamlContent) {
	try {
		return yamljs.parse(yamlContent);
	} catch(e) {
		return null;
	}
}

module.exports = function(content) {
	
	var metaObject;

	if (match = metaRegExp.exec(content)) {
		var yamlContent = match[1];
		metaObject = parseYaml(yamlContent);
		content = content.replace(match[0], ''); 
	}

	return {
		meta: metaObject,
		content: content
	}
}