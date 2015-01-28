/**
 * 	Imports required libraries to window scope (Extend.js and Play.js)
 *  Reads root (target) script full path from 'paramsBroker' web element
 *  Starts root (target) script execution
 */
var TAG = 'LazyLinks | iMacros | '; // Prefix of logs
var configFile = openFile("LazyLinks_config.json");
var config = JSON.parse(readFile(configFile));

if (config.macrosFolder.search('/path/to/') > 0) {
	window.location = 'imacros://run/?m=Config.js';
} else {
	loadAndRun();
}

function loadAndRun() {
	config = JSON.parse(readFile(configFile));
	loadResource(config.macrosFolder + "Utils.js", true);
	loadResource(config.macrosFolder + "Extend.js", true);
	loadResource(config.macrosFolder + "Play.js", true);
	playScriptFromParamsBroker();
}

/**
 * Get script path and play it
 */
function playScriptFromParamsBroker() {
	stopScriptExecution = false;
	extractedVariables = [];
	targetScriptParams = '';
	var clearDisplay = getCookie('hasNeedClearLastError');
	log(clearDisplay);
	if (typeof(clearDisplay) !== 'undefined' && clearDisplay === 'true') {
		iimDisplay(null);
		setCookie('hasNeedClearLastError', false, 365);
	}
	var targetScriptUrl = getTargetScriptUrl();
	if (typeof(targetScriptUrl) !== 'undefined' && targetScriptUrl !== null) {
		play(targetScriptUrl);
	}
}

/**
 * Get script path from web element with id: 'paramsBroker' attribute 'value'
 * @return {String} full path to script, which will be played
 */
function getTargetScriptUrl() {
	var targetScriptElement = content.document.getElementById('paramsBroker');
	if (typeof(targetScriptElement) != 'undefined' && targetScriptElement !== null) {
		var targetScriptNameWithPath = targetScriptElement.getAttribute('value');
		return targetScriptNameWithPath;
	}
	window.console.error(TAG + 'Web element id: "paramsBroker" not found!' +
		'\nProbably Greasemonkey add-on turned OFF or selected tab not same where LazyLink executing!');
	return null;
}

/**
 * Load resource file
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
		if (ajax.readyState === 4) {
			switch (ajax.status) {
				case 200:
					if (applyToWindow) {
						eval.apply(window, [script]);
					} else {
						log("Resource loaded: " + url);
					}
					break;
				default:
					logError("ERROR: resource not loaded: " + url);
			}
		}
	};
	ajax.send();
	return script;
}

/**
 * Prints text to console then DEBUG_MODE = true
 * @param  {String} text text to show
 */
function log(text) {
	if (config.debugMode) {
		window.console.log(TAG, text);
	}
}

/**
 * Prints errors to console and imacros message window
 * @param  {String} text text to show
 */
function logError(text) {
	iimDisplay(text);
	window.console.error(TAG, text);
	setCookie('hasNeedClearLastError', 'true', 365);
}

function openFile(fileName) {
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
		.getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsIFile);
	file.append(fileName);
	return file;
}

function readFile(file) {
	// opens an input stream from file
	var istream = Components.classes["@mozilla.org/network/file-input-stream;1"]
		.createInstance(Components.interfaces.nsIFileInputStream);
	istream.init(file, 0x01, 0444, 0);
	istream.QueryInterface(Components.interfaces.nsILineInputStream);
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