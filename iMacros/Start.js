/**
 * 	Imports required libraries to window scope (Extend.js and Play.js)
 *  Reads root (target) script full path from 'paramsBroker' web element
 *  Starts root (target) script execution
 */
const version = '1.0.3';
const Cc = Components.classes;
const Ci = Components.interfaces;

var TAG = 'LazyLinks | Player |'; // Prefix for logs
var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch); // Get access to all user preferencies file 'prefs.js'
var imVersion = prefs.getComplexValue("extensions.imacros.version", Ci.nsISupportsString).data; // Get iMacros version
var ffVersion = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo).version; // Get Firefox Version
// Config file defaults
var config = {
	"macrosFolder": "file:///c:/path/to/LazyLinks/iMacros/", // URL to ...\LazyLinks\iMacros\ folder
	"scriptsFolder": "http://jkundra/lazylinks/Scripts/", // URL to ...\LazyLinks\Scripts\ folder
	"iMacrosEngineUpdateUrl": "http://jkundra/lazylinks/iMacrosEngine/", // URL where to check version 
	"debugMode": false, // TRUE = shows all logs, FALSE = shows only errors 
	"stopOnError": false, // Stops script execution when error appear
	"pauseOnError": true, // Makes pause on script execution when error appear
	"pauseOnEachLine": false // Makes pauses on each generated macro line, for debugging
};
log('Firefox version: ' + ffVersion + ', iMacros version: ' + imVersion + ', LazyLinksEngine version: ' + version);

config = getConfiguration();

loadAndRun();

/**
 * Load required libraries and start playing script from paramsBroker
 *
 * @since 1.0.0
 */
function loadAndRun() {
	loadResource(config.macrosFolder + "Utils.js", true);
	loadResource(config.macrosFolder + "Extend.js", true);
	loadResource(config.macrosFolder + "Play.js", true);
	playScriptFromParamsBroker();
}

/**
 * Get script path and play it
 *
 * @since 1.0.0
 */
function playScriptFromParamsBroker() {
	stopScriptExecution = false;
	extractedVariables = [];
	targetScriptParams = '';
	/* 
		if before executed script finished with error
		then clear display window and change cookie value
	*/
	var clearDisplay = getCookie('hasNeedClearLastError');
	if (typeof(clearDisplay) !== 'undefined' && clearDisplay === 'true') {
		iimDisplay(null);
		setCookie('hasNeedClearLastError', false, 365);
	}
	var targetScriptUrl = getTargetScriptUrl();
	if (targetScriptUrl === null || targetScriptUrl === '') {
		window.console.error('Target script is empty! Please set targetScript path to web element "pramsBroker" and start again.');
	} else {
		play(targetScriptUrl);
	}
}

/**
 * Get script path from web element with id: 'paramsBroker' attribute 'value'
 *
 * @since 1.0.0
 * @return {String} full path to script, which will be played
 */
function getTargetScriptUrl() {
	var targetScriptElement = content.document.getElementById('paramsBroker');
	if (typeof(targetScriptElement) != 'undefined' && targetScriptElement !== null) {
		var targetScriptNameWithPath = targetScriptElement.getAttribute('value');
		return targetScriptNameWithPath;
	}
	logError(TAG + 'Web element id: "paramsBroker" not found!' +
		'\nProbably Greasemonkey add-on turned OFF or LazyLinks javascripts not added to page source!');
	return null;
}

/**
 * Load resource file
 *
 * @since 1.0.0
 * @param  {String}  url           full path to file name
 * @param  {Boolean} applyToWindow if true then inject loaded script to window scope
 * @return {String}                loaded resource
 */
function loadResource(url, applyToWindow) {
	const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
	var ajax = XMLHttpRequest();
	var script = null;
	ajax.open('GET', url, false); // <-- the 'false' makes it synchronous, true makes it asynchronous
	ajax.onreadystatechange = function() {
		script = ajax.response || ajax.responseText;
		
		function onResponseSuccess() {
			if (applyToWindow) {
				eval.apply(window, [script]);
			} else {
				log("Resource loaded: " + url + " Response status: " + ajax.status);
			}
		};

		if (ajax.readyState === 4) {
			switch (ajax.status) {
				case 200: // OK
					onResponseSuccess();
					break;
				default: // ERROR
					// FIX for Firefox v20, response returns 0 then script download success
					// Remove it then FF20 support will be droped
					if (ffVersion > '19' && ffVersion < '21') {
						onResponseSuccess();
						break;
					}
					logError("ERROR: resource not loaded! Status: " + ajax.status + ", URL: " + url);
			}
		}
	};
	ajax.send();
	return script;
}

/**
 * Prints text to console then DEBUG_MODE = true
 *
 * @since 1.0.0
 * @param  {String} text text to show
 */
function log(text) {
	if (config.debugMode) {
		window.console.log(TAG, text);
	}
}

/**
 * Prints styled text to console then DEBUG_MODE = true
 *
 * @since 1.0.0
 * @param  {String} text text to show
 */
function logStyled(text, cssRules) {
	var defaultStyle = 'color: grey;';
	if (typeof(cssRules) === 'undefined') {
		cssRules = defaultStyle;
	}
	if (config.debugMode) {
		window.console.log('%c' + TAG + ' ' + text, cssRules);
	}
}

/**
 * Prints errors to console and imacros message window
 *
 * @since 1.0.0
 * @param  {String} text text to show
 */
function logError(text) {
	iimDisplay(text);
	window.console.error(TAG, text);
	setCookie('hasNeedClearLastError', 'true', 365);
}

/**
 * Load configuration
 * if exists configuration file loads from them, overwise
 * 	create file configuration file and loads from them
 *
 * @since 1.0.0
 * @return {Object} configuration
 */
function getConfiguration() {
	var file = openFile("LazyLinks_config.json");
	if (!file.exists()) {
		config.macrosFolder = pathToUrl(prefs.getComplexValue("extensions.imacros.defsavepath", Ci.nsISupportsString).data) + '/'; // Get Macros folder
		var configAsString = JSON.stringify(config);
		log('Create configuration file with default values');
		writeToFile(file, configAsString);
	}
	var loadedContent = readFile(file);
	// log(loadedContent);
	return JSON.parse(loadedContent);
}

function openFile(fileName) {
	var file = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	file.append(fileName);
	return file;
}

/**
 * Read file from profile folder
 *
 * @since 1.0.0
 * @param  {String} fileName file name
 * @return {String}          file content
 */
function readFile(file) {
	// opens an input stream from file
	var istream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
	istream.init(file, 0x01, 0444, 0);
	istream.QueryInterface(Ci.nsILineInputStream);
	// reads lines into array
	var line = {},
		lines = [],
		hasmore;
	do {
		hasmore = istream.readLine(line);
		lines.push(line.value);
	} while (hasmore);
	istream.close();
	return lines;
}

/**
 * Write content to file
 *
 * @since 1.0.0
 * @param  {File} file          opened file
 * @param  {String} fileContent content
 */
function writeToFile(file, fileContent) {
	// Write to file
	var fs = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
	fs.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
	fs.write(fileContent, fileContent.length);
	fs.close();
}

/**
 * Convert path to URL
 *
 * @since 1.0.0
 * @param  {String} path absolute path to file
 * @return {String}      URL
 */
function pathToUrl(path) {
	if (path.substring(0, 4) !== 'http') {
		path = 'file:///' + path.replace(/\\/g, '/');
	}
	return path;
}