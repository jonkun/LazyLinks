/**
 * iMacros Engine for LazyLinks utilities
 */
checkVersion(config.macrosFolder, 'New version released.');

/**
 * Import java script and apply to window
 * 
 * @since 1.0.0
 * @param  {String} fileNameOrUrl  java script file name or full path
 */
function include(fileNameOrUrl) {
	var url = makeFullUrl(fileNameOrUrl);
	loadResource(url, true);
}

/**
 * Imports json file and converts it to javascript object
 * 
 * @since 1.0.0
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
 * 
 * @since 1.0.0
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
 * 
 * @since 1.0.0
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
 * 
 * @since 1.0.0
 * @param  {String} paramName    parameter name
 * @param  {Object} defaultValue retunr default value if prameter not exists
 * @return {String}              return a parameter value from the current URL
 */
function getUrlParam(paramName, defaultValue) {
	var sval = "";
	var params = targetScriptParams.split("&");
	// split param and value into individual pieces
	for (var i = 0; i < params.length; i++) {
		temp = params[i].split("=");
		if ([temp[0]] == paramName) {
			sval = temp[1];
		}
	}
	if (sval === 'undefined') {
		return defaultValue;
	}
	return sval;
}

/**
 * Check versions asynchronously
 * Download local varsion file, download remote version file and compare it
 * 
 * @since 1.0.0
 * @param  {String} remoteUrl remote url
 * @param  {String} message   show message then remote version is newest
 */
function checkVersion(remoteUrl, message) {

	// Stop checking if remoteUrl is empty
	if (remoteUrl.length === 0) return;

	loadResourceAsync(remoteUrl + 'version.meta.js', function(remoteVersion) {
		var rVer = stringToObject(remoteVersion).version;
		// log('LazyLinksEngine version : ' + version + ' | remote version: ' + rVer);
		if (version < rVer) {
			var updateMessage = message + '\nLocal version: ' + version + '\n' + 'Newest version: ' + rVer;
			iimDisplay(updateMessage);
		}
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
					case 0:
						// FIX for Firefox v20, returns 0 then script download success
						// Remove it then FF20 suppord will be droped
						callback(script);
						break;
					default:
						logError("ERROR: on version checking  " + url + " Response status: " + ajax.status);
				}
			}
		};
		ajax.send();
	}
}

/**
 * Shortest function to get element by id
 * 
 * @since 1.0.0
 * @param  {String} elementId element id
 * @return {HTMLElement}      HTML elemenet
 */
function id(elementId) {
	return content.document.getElementById(elementId);
}


/**
 * For script or resource loading needs full path until script or resource.
 * If given script or resource path is not in full then it will be changed
 * according to root (target) script path.
 *
 * Example:
 *  ---------------------------------------------------------------------------------
 * 	Root (target) script path: file://c:/path/to/Scripts/launchedScript.js
 * ----------------------------------------------------------------------------------
 *  fileNameOrUrl                       | returns
 * ----------------------------------------------------------------------------------
 *  file://c:/path/to/Scripts/script.js | file://c:/path/to/Scripts/script.js
 *  http://c:/path/to/Scripts/script.js | http://c:/path/to/Scripts/script.js
 *  ./script.js                         | rootScriptPath +/script.js
 *  ./../json/macros.json               | rootScriptPath + /json/macros.json
 *  /utils/utils.js                     | config.scriptsFolder + /utils/utils.js
 *  utils/utils.js                      | config.scriptsFolder + '/' + utils/utils.js
 *  /utils/utils.js?param=val           | config.scriptsFolder + '/' + utils/utils.js
 *                                      |           and parameters saves to urlParams
 * ----------------------------------------------------------------------------------
 *
 * 
 * @since 1.0.0
 * @param  {String} fileNameOrUrl file name or path
 * @return {String}               full path to file
 */
function makeFullUrl(fileNameOrUrl) {
	var url = null;
	// check has url params
	if (fileNameOrUrl.indexOf("?") > -1) {
		targetScriptParams = fileNameOrUrl.split('?')[1];
		fileNameOrUrl = fileNameOrUrl.split('?')[0];
	}
	if (fileNameOrUrl.substr(0, 4) === "file" || fileNameOrUrl.substr(0, 4) === "http") {
		url = fileNameOrUrl;
	} else if (fileNameOrUrl[0] === '.') {
		url = rootScriptPath + fileNameOrUrl;
	} else {
		if (fileNameOrUrl[0] === '/') {
			fileNameOrUrl = fileNameOrUrl.substr(1, fileNameOrUrl.length - 1);
		}
		url = config.scriptsFolder + fileNameOrUrl;
	}
	// log('Full url: ' + url);
	return url;
}

// ----------------------------------------------------------------------------
// Methods for Coookies
// ----------------------------------------------------------------------------
/**
 * Save cookie by given name
 * 
 * @since 1.0.0
 * @param {String} cname  cookie name
 * @param {String} cvalue value
 * @param {Number} exdays shelf life in days
 */
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	content.document.cookie = cname + "=" + cvalue + "; " + expires;
	// log('Saved cookie: "' + cname + '" value: "' + cvalue + '" expires: ' + exdays);
}

/**
 * Get cookie value by given name
 * 
 * @since 1.0.0
 * @param  {String} cname cookie name
 * @return {String}       cookie value
 */
function getCookie(cname) {
	var name = cname + "=";
	var ca = content.document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
	}
	return "";
}

