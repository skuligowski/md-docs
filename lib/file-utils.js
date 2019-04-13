const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const yamljs = require('yamljs');
const log = require('./logger');

function walkSync(dir) {
	let result = [];
	const files = fs.readdirSync(dir);

	for (let i = 0; i < files.length; i++) {
		const filename = files[i],
			file = path.join(dir, filename),
			stat = fs.statSync(file);

		if (stat && stat.isDirectory()) {
			result = result.concat(walkSync(file));
		} else {
			result.push(file);
		}
	}
	return result;
}

function isFileExists(file) {
	const fs = require('fs');
	try {
		const stats = fs.lstatSync(file);
		if (stats.isFile()) {
			return true;
		}
	} catch(e) {}
	return false;
}

function copyFiles(filesToCopy) {
	for(let i = 0; i < filesToCopy.length; ++i) {
		fse.copySync(filesToCopy[i].from, filesToCopy[i].to);
		log.debug('copy: \n from', filesToCopy[i].from, ' \n to ', filesToCopy[i].to);
	}
}

function parseYaml(file) {
	const configContent = fs.readFileSync(file, 'utf-8');
	return yamljs.parse(configContent);
}

function saveYaml(file, nativeObject) {
	const yamlString = yamljs.stringify(nativeObject, 4);
	fs.writeFileSync(file, yamlString);
}

module.exports = {
	walkSync: walkSync,
	isFileExists: isFileExists,
	copyFiles: copyFiles,
	parseYaml: parseYaml,
	saveYaml: saveYaml,
};
