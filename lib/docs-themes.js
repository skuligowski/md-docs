var yamljs = require('yamljs');
var fs = require('fs');
var path = require('path');

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

module.exports = {
	readThemesStack: readThemesStack
}