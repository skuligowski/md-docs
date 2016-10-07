var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var yamljs = require('yamljs');
var log = require('./logger');

function walkSync(dir) {
	var result = [],
		files = fs.readdirSync(dir);

	for (var i = 0; i < files.length; i++) {
		var filename = files[i],
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
	var fs = require('fs');
	try {
		var stats = fs.lstatSync(file);
		if (stats.isFile()) {
			return true;
		}
	} catch(e) {}
	return false;
}

function copyFiles(filesToCopy) {
	for(var i = 0; i < filesToCopy.length; ++i) {
		fse.copySync(filesToCopy[i].from, filesToCopy[i].to);
		log.debug('copy: \n from', filesToCopy[i].from, ' \n to ', filesToCopy[i].to);
	}
}

function parseYaml(file) {
	var configContent = fs.readFileSync(file, 'utf-8');		
	return yamljs.parse(configContent);
}

function saveYaml(file, nativeObject) {
	var yamlString = yamljs.stringify(nativeObject, 4);
	fs.writeFileSync(file, yamlString);
}

module.exports = {
	walkSync: walkSync,
	isFileExists: isFileExists,
	copyFiles: copyFiles,
	parseYaml: parseYaml,
	saveYaml: saveYaml
};