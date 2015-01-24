/**
 * Import java script and apply to window
 * @param  {String} fileNameOrUrl  java script file name or full path
 */
function include(fileNameOrUrl) {
	var url = makeFullUrl(fileNameOrUrl);
	loadResource(url, true);
}

/**
 * Imports json file and converts it to javascript object
 * @param  {String} fileNameOrUrl  json file name or full path
 * @return {Object}                java script object
 */
function load(fileNameOrUrl) {
	var url = makeFullUrl(fileNameOrUrl);
	var scriptAsString = loadResource(url);
	// log("Json resource '" + url + "' import finished");
	return stringToObject(scriptAsString);
}

/**
 * Convert (evaluate) string to java script object
 * @param  {String} string script source
 * @return {Object}        java script object
 */
function stringToObject(string) {
	var object;
	eval('object = ' + string);
	// log("Text coverted to JavaScript object");
	return object;
}

/**
 * Import macros json file and extends it
 * @param  {String} macrosJsonNameOrUrl json file name of full path
 * @return {Object}                     java script object with added methods:
 *                                           value, selectbyText, selectByCode, selectByIndex, click
 */
function macros(macrosJsonNameOrUrl) {
	var importedJson = load(macrosJsonNameOrUrl);
	var extendedMacros = extendMacro(importedJson);
	return extendedMacros;
}

/**
 * Return a parameter value from the target script URL parameters
 * @param  {String} paramName parameter name
 * @return {String}           return a parameter value from the current URL
 */
function getUrlParam(paramName) {
	var sval = "";
	var params = targetScriptParams.split("&");
	// split param and value into individual pieces
	for (var i = 0; i < params.length; i++) {
		temp = params[i].split("=");
		if ([temp[0]] == paramName) {
			sval = temp[1];
		}
	}
	return sval;
}

checkVersion(macrosFolder, iMacrosEngineUpdateUrl, 'Please update iMacros sources');

/**
 * Check versions asynchronously
 * Download local varsion file, download remote version file and compare it
 * @param  {String} localUrl  local url
 * @param  {String} remoteUrl remote url
 * @param  {String} message   show message then remote version is newest
 */
function checkVersion(localUrl, remoteUrl, message) {

	// Stop checking if remoteUrl is empty
	if (remoteUrl.length === 0) return;

	loadResourceAsync(localUrl + 'version.meta.js', function(localVersion) {
		loadResourceAsync(remoteUrl + 'version.meta.js', function(remoteVersion) {
			var lVer = stringToObject(localVersion).version;
			var rVer = stringToObject(remoteVersion).version;
			log('iMacros Engine | local version : ' + lVer + ' | remote version: ' + rVer);
			if (lVer < rVer) {
				var updateMessage = message + '\nLocal version: ' + lVer + '\n' + 'Newest version: ' + rVer;
				iimDisplay(updateMessage);
			}
		});
	});

	function loadResourceAsync(url, callback) {
		const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
		var ajax = XMLHttpRequest();
		var script = null;
		ajax.open('GET', url, true); // <-- the 'false' makes it synchronous, true makes it asynchronous
		ajax.onreadystatechange = function() {
			script = ajax.response || ajax.responseText;
			if (ajax.readyState === 4) {
				switch (ajax.status) {
					case 200:
						callback(script);
						break;
					default:
						logError("ERROR: on version checking  " + url);
				}
			}
		};
		ajax.send();
	}
};