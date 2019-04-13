const yamljs = require('yamljs');
const log = require('./logger');

module.exports = function(content, filePath) {
	
	function parseYaml(yamlContent) {
		try {
			return yamljs.parse(yamlContent);
		} catch(e) {
			throw new log.Error('Invlid yaml header in', log.colors.green(filePath));
		}
	}

	function validateMeta(meta) {
		if (!meta.book) {
			throw new log.Error('Undefined book property in yaml header in', log.colors.green(filePath));
		}
	}

	const metaRegExp = /^---([\s\S]*?)^---/mg;
	let	file;
	let match;
		
	if (match = metaRegExp.exec(content)) {
		const yamlContent = match[1];
		file = parseYaml(yamlContent) || {};
		file.content = content.replace(match[0], '');
	} else {
		throw new log.Error('Missing yaml header in', log.colors.green(filePath));
	}
	
	validateMeta(file);

	return file;
}
