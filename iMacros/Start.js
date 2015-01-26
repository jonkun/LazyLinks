/**
 * 	Imports required libraries to window scope (Extend.js and Play.js)
 *  Reads root (target) script full path from 'paramsBroker' web element
 *  Starts root (target) script execution
 */
/* Properties */
var macrosFolder = "file:///c:/src/LazyLinks/iMacros/"; // URL to ...\LazyLinks\iMacros\ folder
// var macrosFolder = "file://d:/exigen/src/LazyLinks/iMacros/"; // URL to ...\LazyLinks\iMacros\ folder
var scriptsFolder = "file:///c:/src/LazyLinks//Scripts/"; // URL to ...\LazyLinks\Scripts\ folder
// var scriptsFolder = "file://d:/exigen/src/LazyLinks/Scripts/"; // URL to ...\LazyLinks\Scripts\ folder
var iMacrosEngineUpdateUrl = "http://jkundra/lazylinks/iMacros/"; // URL where to check version 
var DEBUG_MODE = true; // TRUE = shows all logs, FALSE = shows only errors 
var TAG = 'LazyLinks | iMacros | '; // Prefix of logs

loadResource(macrosFolder + "Utils.js", true);
loadResource(macrosFolder + "Extend.js", true);
loadResource(macrosFolder + "Play.js", true);

playScriptFromParamsBroker();

/**
 * Get script path and play it
 */
function playScriptFromParamsBroker() {
	stopScriptExecution = false;
	extractedVariables = [];
	targetScriptParams = '';
	// iimDisplay(null);
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
	if (DEBUG_MODE) {
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
}
