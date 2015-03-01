/**
 * Download LazyLinks Player scripts and save it to iMacros scripts folder
 *
 * @return {Boolean} true if update success, otherwise return false
 */
function Install(forceUpdate) {

	const Cc = Components.classes;
	const Ci = Components.interfaces;
	const URL = 'https://github.com/jonkun/LazyLinks/raw/master/iMacros/';
	const TAG = 'LLPlayer Update Manager';

	var llPLayerFiles = ['Start.js', 'Play.js', 'Extend.js', 'Utils.js', 'Config.js'];

	if (typeof forceUpdate !== 'undefined' && forceUpdate) {
		l('Force update == true');
		downloadFiles(llPLayerFiles);
		return;
	}

	if (!allFilesExists(llPLayerFiles)) {
		downloadFiles(llPLayerFiles);
		// Turn off: Show Javascript during replay
		// setPreference('extensions.imacros.showjs', false);
	}

	function downloadFiles(llPLayerFiles) {
		for (var i in llPLayerFiles) {
			var name = llPLayerFiles[i];
			var file = openFile(getMacrosForlder(), name);
			writeToFile(file, getResource(URL + name));
		}
		if (typeof version === 'undefined') {
			alert('iMacros scripts installiation finished, please continue and install greasemonkey scripts');
		} else {
			alert('iMacros scripts update finished!');
		}
	}

	function allFilesExists(llPLayerFiles) {
		for (var i in llPLayerFiles) {
			if (!openFile(getMacrosForlder(), llPLayerFiles[i]).exists()) {
				l('File not exists: ' + getMacrosForlder() + llPLayerFiles[i]);
				return false;
			}
		}
		return true;
	}

	function getResource(url, applyToGlobal) {
		const XMLHttpRequest = Components.Constructor("@mozilla.org/xmlextras/xmlhttprequest;1");
		var ajax = XMLHttpRequest();
		var script = null;
		ajax.open('GET', url, false); // <-- the 'false' makes it synchronous, true makes it asynchronous
		ajax.onreadystatechange = function() {
			script = ajax.response || ajax.responseText;
			if (ajax.readyState === 4) {
				switch (ajax.status) {
					case 200:
						// eval.apply(window, [script]);
						if (script.match(/Error 404/gi)) {
							window.console.error("ERROR: resource not loaded: " + url);
						}
						break;
					default:
						window.console.error("ERROR: resource not loaded: " + url);
				}
			}
		};
		ajax.send();
		return script;
	}

	function openFile(path, fileName) {
		// var file = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(path);
		file.append(fileName);
		return file;
	}

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

	function writeToFile(file, fileContent) {
		// Write to file
		var fs = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
		fs.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
		fs.write(fileContent, fileContent.length);
		fs.close();
	}

	function getMacrosForlder() {
		var macFolder = getPreference("extensions.imacros.defsavepath");
		if (macFolder[macFolder.length - 1] !== '\\') {
			macFolder += '\\';
		}
		l(macFolder);
		// return macFolder + '\\Downloads\\';
		return macFolder;
	}

	/**
	 * Get preference value
	 *
	 * c:\Users\<user name>\AppData\Roaming\Mozilla\Firefox\Profiles\<profile name>\prefs.js
	 *
	 * @param  {String} name pref name
	 * @return {String}      pref value
	 */
	function getPreference(name) {
		var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
		var data = prefs.getComplexValue("extensions.imacros.defsavepath", Ci.nsISupportsString).data;
		return data;
	}

	// function setPreference(name, value) {
	// 	var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
	// 	if (typeof value === 'boolean') {
	// 		prefs.setBoolPref("typeaheadfind", value);
	// 	}
	// }

	function l(text) {
		window.console.log(TAG, text);
	}

};

Install(false);