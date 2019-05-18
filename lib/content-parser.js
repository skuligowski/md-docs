const yamljs = require('yamljs');
const log = require('./logger');

module.exports = (content, filePath) => {
	
	function parseYaml(yamlContent) {
		try {
			return yamljs.parse(yamlContent);
		} catch(e) {
			throw new log.Error('Invalid yaml header in', log.colors.green(filePath));
		}
	}

	function validateMeta(meta) {
		if (!meta.book) {
			throw new log.Error('Undefined book property in yaml header in', log.colors.green(filePath));
		}
	}

	const metaRegExp = /^---([\s\S]*?)^---/mg;
	const match = metaRegExp.exec(content);
	let	file;

	if (match) {
		const yamlContent = match[1];
		file = parseYaml(yamlContent) || {};
		file.content = content.replace(match[0], '');
	} else {
		throw new log.Error('Missing yaml header in', log.colors.green(filePath));
	}
	
	validateMeta(file);

	return file;
};
