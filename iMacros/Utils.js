/**
 * LazyLinks Player utilities
 */

/**
 * Check versions asynchronously
 * Download local varsion file, download remote version file and compare it
 *
 * @class UpdateManager
 * @constructor
 * @since 1.0.0
 * @param  {String} remoteUrl remote url
 * @param  {String} message   show message then remote version is newest
 */
function UpdateManager(remoteUrl, message) {

	// Stop checking if remoteUrl is empty
	if (remoteUrl.length === 0) return;

	loadResourceAsync(remoteUrl, function(remoteVersion) {
		try {

			var rVer = stringToObject(remoteVersion).version;
			log('LazyLinksPLayer version : ' + version + ' <> remote version: ' + rVer);
			if (version < rVer) {
				var updateMessage = message + '\nLocal version: ' + version + '\n' + 'Newest version: ' + rVer;
				iimDisplay(updateMessage);
				var Install = load(config.macrosFolder + "Install.js");
				Install(true);
			}
		} catch (error) {
			logError('Error on version checking! ' + error);
		}
	});

	function stringToObject(string) {
		var object;
		eval('object = ' + string);
		return object;
	}

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
 * Same function as content.document.getElementById()
 *
 * @since 1.0.0
 * @param  {String} elementId element id
 * @return {HTMLElement}      HTML elemenet
 */
function id(elementId) {
	return content.document.getElementById(elementId);
}

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


