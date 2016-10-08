var fs = require('fs');
var fileUtils = require('./file-utils');
var path = require('path');
var _ = require('lodash');
var log = require('./logger');

var themesDir = path.join(__dirname, '..', 'themes');
var THEME_CONFIG_FILE = 'theme.yaml';

function getConfigFile(theme) {
	var configFile = path.join(theme, THEME_CONFIG_FILE);
	if (path.isAbsolute(configFile) && fileUtils.isFileExists(configFile)) {			
		return configFile;
	} else {
		var processDirConfigFile = path.join(process.cwd(), configFile);
		if (fileUtils.isFileExists(processDirConfigFile)) {
			return processDirConfigFile;
		} 

		var themesDirConfigFile = path.join(themesDir, configFile);
		if (fileUtils.isFileExists(themesDirConfigFile)) {
			return themesDirConfigFile;
		}

		logMissingTheme(theme);		
	}
	return null;
}

function saveConfigFile(parent) {
	var configFile = path.join(process.cwd(), THEME_CONFIG_FILE);
	fileUtils.saveYaml(configFile, { parent: parent });
}

function readThemesStack(theme) {
	var themesStack = [];
	while(theme) {
		var configFile = getConfigFile(theme);
		if (configFile) {
			var config = fileUtils.parseYaml(configFile);
			config.path = path.dirname(configFile);
			themesStack.push(config);
			theme = config.parent;
		} else {
			theme = null;
		}
	}
	return themesStack;
}

function getEmbeddedThemes() {
	return fs.readdirSync(themesDir);
}

function listThemes() {
	var embeddedThmes = getEmbeddedThemes();
	_(embeddedThmes)
		.map(getConfigFile)
		.map(fileUtils.parseYaml)
		.each(function(config) {
			if (config.name === 'default') {
				log.info(log.colors.red(config.name));	
			} else {
				log.info(log.colors.green(config.name) + ' (parent: ' + config.parent + ')');
			}
		});
}

function buildFilesMap(themesStack) {
	var filesMap = {};
	for(var i = 0; i < themesStack.length; ++i) {		
		appendThemeFiles(themesStack[i].path, filesMap);
	}
	delete filesMap[THEME_CONFIG_FILE];
	return filesMap;
}

function appendThemeFiles(themeDir, map) {
	var files = fileUtils.walkSync(themeDir);
	var currentDir = process.cwd();
	for(var i = 0; i < files.length; ++i) {
		var relativeFile = path.relative(themeDir, files[i]);
		map[relativeFile] = {from: files[i], to: path.join(currentDir, relativeFile)};
	}
}

function logMissingTheme(theme) {
	log.error('Theme ' + log.colors.green(theme) +' not found');
	log.info('Use one of the following embedded themes:');
	listThemes();	
}

function initTheme(parent) {
	parent = parent || 'default';
	var embeddedThemes = getEmbeddedThemes();
	if (embeddedThemes.indexOf(parent) === -1) {
		return logMissingTheme(parent);
	}

	var themesStack = readThemesStack(parent);
	log.info('Initializing theme using parents: ' + log.colors.green(_.map(themesStack, 'name')));

	var filesMap = buildFilesMap(themesStack.reverse());
	var filesToCopy = _.values(filesMap);
	fileUtils.copyFiles(filesToCopy);
	saveConfigFile(parent);
}

function readThemePaths(theme) {
	var themesStack = readThemesStack(theme);		
	return _(themesStack).map('path').value();
}

module.exports = {
	readThemePaths: readThemePaths,
	initTheme: initTheme,
	listThemes: listThemes
};