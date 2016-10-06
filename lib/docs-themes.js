var yamljs = require('yamljs');
var fs = require('fs');
var fse = require('fs-extra');
var path = require('path');
var _ = require('lodash');

function readConfig(configFile) {
	var configContent = fs.readFileSync(configFile, 'utf-8');		
	var config = yamljs.parse(configContent);
	return config;
}

function isExists(file) {
	var fs = require('fs');
	try {
		var stats = fs.lstatSync(file);
		if (stats.isFile()) {
			return true;
		}
	} catch(e) {}
	return false;
}

function getConfigFile(theme) {
	var themePath;
	var configFile = path.join(theme, 'theme.yaml');
	if (path.isAbsolute(configFile) && isExists(configFile)) {			
		return configFile;
	} else {
		var processDirConfigFile = path.join(process.cwd(), configFile);
		if (isExists(processDirConfigFile)) {
			return processDirConfigFile;
		} 

		var themesDirConfigFile = path.join(__dirname, '..', 'player', configFile);
		if (isExists(themesDirConfigFile)) {
			return themesDirConfigFile;
		}			
	}
	return null;
}

function readThemesStack(theme) {
	var themesStack = [];
	while(theme) {
		var configFile = getConfigFile(theme);
		if (configFile) {
			var config = readConfig(configFile);
			config.path = path.dirname(configFile);
			themesStack.push(config);
			theme = config.parent;
		} else {
			theme = null;
		}
	}
	return themesStack;
}

function listThemes() {
	var themes = fs.readdirSync(path.join(__dirname, '..', 'player'));
	console.log(themes);
	return themes;
}


function initTheme(parent) {
	console.log(parent)
	parent = parent || 'default';
	var embeddedThemes = listThemes();
	if (embeddedThemes.indexOf(parent) === -1) {
		log.error('Wrong theme');
		return;
	}
	
	var themesStack = readThemesStack(parent).reverse();
	var filesMap = {};	
	for(var i = 0; i < themesStack.length; ++i) {
		buildFilesMap(themesStack[i].name, walkSync(themesStack[i].path), filesMap);
	}
	delete filesMap['theme.yaml'];

	var filesToCopy = _.values(filesMap);
	for(var i = 0; i < filesToCopy.length; ++i) {
		//fse.copySync(filesToCopy[i].from, filesToCopy[i].to);
		console.log('copy: \n from', filesToCopy[i].from, ' \n to ', filesToCopy[i].to);
	}
}

function buildFilesMap(theme, files, map) {
	var themeDir = path.join(__dirname, '..', 'player', theme);
	var currentDir = process.cwd();
	for(var i = 0; i < files.length; ++i) {
		var relativeFile = path.relative(themeDir, files[i]);
		map[relativeFile] = {from: files[i], to: path.join(currentDir, relativeFile)};
	}
}

function walkSync(dir, transformFn) {
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


module.exports = {
	readThemesStack: readThemesStack,
	initTheme: initTheme
}