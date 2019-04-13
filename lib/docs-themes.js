const fs = require('fs');
const fileUtils = require('./file-utils');
const path = require('path');
const _ = require('lodash');
const log = require('./logger');

const themesDir = path.join(__dirname, '..', 'themes');
const THEME_CONFIG_FILE = 'theme.yaml';

function getConfigFile(theme) {
	const configFile = path.join(theme, THEME_CONFIG_FILE);
	if (path.isAbsolute(configFile) && fileUtils.isFileExists(configFile)) {
		return configFile;
	} else {
		const processDirConfigFile = path.join(process.cwd(), configFile);
		if (fileUtils.isFileExists(processDirConfigFile)) {
			return processDirConfigFile;
		} 

		const themesDirConfigFile = path.join(themesDir, configFile);
		if (fileUtils.isFileExists(themesDirConfigFile)) {
			return themesDirConfigFile;
		}

		logMissingTheme(theme);
	}
	return null;
}

function saveConfigFile(parent) {
	const configFile = path.join(process.cwd(), THEME_CONFIG_FILE);
	fileUtils.saveYaml(configFile, { parent: parent });
}

function readThemesStack(theme) {
	const themesStack = [];
	while(theme) {
		const configFile = getConfigFile(theme);
		if (configFile) {
			const config = fileUtils.parseYaml(configFile);
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
	const embeddedThmes = getEmbeddedThemes();
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
	const filesMap = {};
	for(let i = 0; i < themesStack.length; ++i) {
		appendThemeFiles(themesStack[i].path, filesMap);
	}
	delete filesMap[THEME_CONFIG_FILE];
	return filesMap;
}

function appendThemeFiles(themeDir, map) {
	const files = fileUtils.walkSync(themeDir);
	const currentDir = process.cwd();
	for(let i = 0; i < files.length; ++i) {
		const relativeFile = path.relative(themeDir, files[i]);
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
	const embeddedThemes = getEmbeddedThemes();
	if (embeddedThemes.indexOf(parent) === -1) {
		return logMissingTheme(parent);
	}

	const themesStack = readThemesStack(parent);
	log.info('Initializing theme using parents: ' + log.colors.green(_.map(themesStack, 'name')));

	const filesMap = buildFilesMap(themesStack.reverse());
	const filesToCopy = _.values(filesMap);
	fileUtils.copyFiles(filesToCopy);
	saveConfigFile(parent);
}

function readThemePaths(theme) {
	const themesStack = readThemesStack(theme);
	return _(themesStack).map('path').value();
}

module.exports = {
	readThemePaths: readThemePaths,
	initTheme: initTheme,
	listThemes: listThemes
};
