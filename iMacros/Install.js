/**
 * Download LazyLinks Player scripts and save it to iMacros scripts folder
 *
 * @class Install
 * @constructor
 */
function Install() {

	const Cc = Components.classes;
	const Ci = Components.interfaces;
	const URL = 'https://raw.githubusercontent.com/jonkun/LazyLinks/master/iMacros/';
	const TAG = 'LLPlayer Update Manager';
	const llPLayerFiles = ['Play.js', 'Start.js', 'Extend.js', 'Utils.js', 'Config.js', 'Install.js'];

	var isInstallation = !allFilesExists(llPLayerFiles);

	downloadFiles(llPLayerFiles);

	if (isInstallation) {
		alert('iMacros scripts installiation finished, please continue and install greasemonkey scripts');
	} else {
		iimDisplay('iMacros scripts updated!');
	}

	/**
	 * Download and save files to iMacros scripts folder
	 *
	 * @param  {Array}  llPLayerFiles LayzLinks Player scripts files names
	 */
	function downloadFiles(llPLayerFiles) {
		for (var i in llPLayerFiles) {
			var name = llPLayerFiles[i];
			var file = openFile(getMacrosForlder(), name);
			writeToFile(file, getResource(URL + name));
		}
	}

	/**
	 * Check that all given files exists
	 *
	 * @param  {Array}   llPLayerFiles file names
	 * @return {Boolean}               return true is all files exists, otherwise return false
	 */
	function allFilesExists(llPLayerFiles) {
		for (var i in llPLayerFiles) {
			if (!openFile(getMacrosForlder(), llPLayerFiles[i]).exists()) {
				l('File not exists: ' + getMacrosForlder() + llPLayerFiles[i]);
				return false;
			}
		}
		return true;
	}

	/**
	 * Download resource by given url
	 *
	 * @param  {String} url  resource url
	 * @return {String}      reource content
	 */
	function getResource(url) {
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
						break;
					default:
						window.console.error("ERROR: resource not loaded: " + url);
				}
			}
		};
		ajax.send();
		return script;
	}

	/**
	 * Open file
	 *
	 * @param  {String}       path     path until file name
	 * @param  {String}       fileName file name
	 * @return {nsILocalFile}          nsILocalFile
	 */
	function openFile(path, fileName) {
		// var file = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(path);
		file.append(fileName);
		return file;
	}

	/**
	 * Read local file
	 *
	 * @param  {nsILocalFile} file file
	 * @return {string}            file content
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
	 * @param  {nsILocalFile} file        file
	 * @param  {String}       fileContent file content
	 */
	function writeToFile(file, fileContent) {
		// Write to file
		var fs = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
		fs.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
		fs.write(fileContent, fileContent.length);
		fs.close();
	}


	/**
	 * Get iMacros scripts folder path
	 *
	 * @return {String} return iMacros scripts folder
	 */
	function getMacrosForlder() {
		var macFolder = getPreference("extensions.imacros.defsavepath");
		if (macFolder[macFolder.length - 1] !== '\\') {
			macFolder += '\\';
		}
		// l(macFolder);
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


	/**
	 * Print log
	 * @param  {String} text text to print
	 */
	function l(text) {
		window.console.log(TAG, text);
	}

};

new Install();