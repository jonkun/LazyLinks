/**
 * How To:
 * 	- Write to file: 	http://stackoverflow.com/questions/23705970/firefox-extension-write-data-to-file
 * 	- Read from file: 	https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
 */

const Cc = Components.classes;
const Ci = Components.interfaces;

// Config file default value
var config = {
	// Default values
	"macrosFolder": "file:///c:/path/to/LazyLinks/iMacros/",
	"scriptsFolder": "http://jkundra/lazylinks/Scripts/",
	"iMacrosEngineUpdateUrl": "http://jkundra/lazylinks/iMacros/",
	"debugMode": false
};


// LazyLinks configuration HTML file content
var html = '<html> \
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type"> \
	<meta content="utf-8" http-equiv="encoding">\
	<head>\
		<title>LazyLinks Configuration</title>\
		<link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.5.0/pure-min.css">\
		<style>\
			#container {\
	            width: 100%;\
	            clear: both;\
	        }\
	        #content {\
	            margin: auto;\
	            position:relative;\
	            width:650px;\
	        }\
		</style>\
	</head>\
	<body id="container">\
		<div id="content">\
			<form id="lazylinksConfigForm" class="pure-form pure-form-aligned">\
				<div class="header">\
					<h1 style="text-align: center;">LazyLinks settings</h1>\
				</div>\
				<fieldset>\
					<legend></legend>\
					<div class="pure-control-group">\
						<label for="macrosFolderId">iMacros Folder</label>\
						<input id="macrosFolderId" type="text" size="40" value="">\
						<button id="selectMacrosFolderId" class="pure-button">Browse...</button> \
					</div>\
					<div class="pure-control-group">\
						<label for="scriptsFolderId">Scripts Folder or URL</label>\
						<input id="scriptsFolderId" type="text" size="40" value="">\
						<button id="selectScriptsFolderId" class="pure-button">Browse...</button> \
					</div>\
					<div class="pure-control-group">\
						<label for="updateUrlId">iMacros Engine Update URL</label>\
						<input id="updateUrlId" type="text" size="40" value="">\
					</div>\
					<div class="pure-control-group">\
						<label for="updateUrlId">Debug Mode</label>\
						<input id="debugModeOn" type="radio" name=myradio value="true"> On \
						<input id="debugModeOff" type="radio" name=myradio value="false"> Off \
					</div>\
					<div class="pure-controls">\
						<button id="cancelBtn" class="pure-button pure-button-primary">Close</button>\
					</div>\
				</fieldset>\
			</form>\
		</div>\
	</body>\
</html>';


/* Create LazyLinks html file on firefox profile folder */
var lazyLinksHtmlFile = openFile("LazyLinks_config.html");
writeToFile(lazyLinksHtmlFile, html);
var pathURL = pathToUrl(lazyLinksHtmlFile.path);

/* Load create HTML fille */
/* https://developer.mozilla.org/en-US/docs/Web/API/Window.open */
var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
var mainWindow = wm.getMostRecentWindow("navigator:browser");
var gBrowser = mainWindow.gBrowser;
// require open new tab, because window.opne() not works on opened page
var newTabBrowser = gBrowser;
if (window.location.toString() !== 'about:newtab' && window.location.toString() !== pathURL) {
	gBrowser.selectedTab = gBrowser.addTab('about:newtab');
	// newTabBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);;
}

if (window.location.toString() !== pathURL) {
	gBrowser.loadURI(pathURL);
	onPageLoadListener();
}

function onPageLoadListener() {
	gBrowser.addEventListener("load", function load(event) {
		gBrowser.removeEventListener("load", load, false); //remove listener, no longer needed

		var doc = newTabBrowser.contentDocument;
		var imacrosFolderElement = doc.getElementById('macrosFolderId');
		var imacrosFolderBtnElement = doc.getElementById('selectMacrosFolderId');
		var scriptsFolderElement = doc.getElementById('scriptsFolderId');
		var scriptsFolderBtnElement = doc.getElementById('selectScriptsFolderId');
		var updateUrlElement = doc.getElementById('updateUrlId');
		var debugModeOnElement = doc.getElementById('debugModeOn');
		var debugModeOffElement = doc.getElementById('debugModeOff');
		var closeBtnElement = doc.getElementById('cancelBtn');

		imacrosFolderBtnElement.onclick = function() {
			var selectedFolder = showSelectFolderDialog();
			if (selectedFolder != null) {
				config.macrosFolder = pathToUrl(appendSlash(selectedFolder));
				saveConfiguration();
			}
		};

		scriptsFolderBtnElement.onclick = function() {
			var selectedFolder = showSelectFolderDialog();
			if (selectedFolder != null) {
				config.scriptsFolder = pathToUrl(appendSlash(selectedFolder));
				saveConfiguration();
			}
		};

		updateUrlElement.onchange = function() {
			config.iMacrosEngineUpdateUrl = updateUrlElement.value;
			saveConfiguration();
		};

		debugModeOnElement.onclick = function() {
			debugModeOnElement.checked = true;
			debugModeOffElement.checked = false;
			config.debugMode = true;
			saveConfiguration();
		};

		debugModeOffElement.onclick = function() {
			debugModeOnElement.checked = false;
			debugModeOffElement.checked = true;
			config.debugMode = false;
			saveConfiguration();
		};

		closeBtnElement.onclick = function() {
			window.close();
		};

		/* Loads configuration to page */
		config = getConfiguration();
		imacrosFolderElement.value = urlToPath(config.macrosFolder);
		scriptsFolderElement.value = urlToPath(config.scriptsFolder);
		updateUrlElement.value = config.iMacrosEngineUpdateUrl;
		if (config.debugMode) {
			debugModeOnElement.checked = true;
			debugModeOffElement.checked = false;
		} else {
			debugModeOnElement.checked = false;
			debugModeOffElement.checked = true;
		}

	}, true);
}


/**
 * ----------------------------------------------------------------------------
 *                      Manage  files and folders
 *  ---------------------------------------------------------------------------
 */

function showSelectFolderDialog() {
	// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	const nsIFilePicker = Components.interfaces.nsIFilePicker;

	var fp = Components.classes["@mozilla.org/filepicker;1"]
		.createInstance(nsIFilePicker);
	fp.init(window, "Dialog Title", nsIFilePicker.modeGetFolder);
	fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

	var rv = fp.show();
	if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
		var file = fp.file;
		// Get the path as string. Note that you usually won't 
		// need to work with the string paths.
		var path = fp.file.path;
		return path;
		// work with returned nsILocalFile...
	}
	return null;
}

/**
 * Load configuration
 * if exists configuration file loads from them, overwise
 * 	create file configuration file and loads from them
 * @return {Object} configuration
 */
function getConfiguration() {
	var file = openFile("LazyLinks_config.json");
	if (!file.exists()) {
		// if file not exists load defaults
		saveConfiguration();
	}
	var loadedContent = readFile(file);
	// log(loadedContent);
	return JSON.parse(loadedContent);
}

function saveConfiguration() {
	var file = openFile("LazyLinks_config.json");
	var configAsString = JSON.stringify(config);
	log('Create configuration file with default values');
	writeToFile(file, configAsString);
}

function openFile(fileName) {
	var file = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
	file.append(fileName);
	return file;
}

function writeToFile(file, fileContent) {
	// Write to file
	var fs = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
	fs.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate
	fs.write(fileContent, fileContent.length);
	fs.close();
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

/**
 * ----------------------------------------------------------------------------
 *                      Utilities
 *  ---------------------------------------------------------------------------
 */
function pathToUrl(path) {
	if (path.substring(0, 4) !== 'http') {
		path = 'file:///' + path.replace(/\\/g, '/');
	}
	return path;
}

function urlToPath(url) {
	if (url.substring(0, 4) !== 'file') {
		return url;
	}
	url = url.replace('file:///', '').replace(/\//g, '\\');
	return url;
}

function appendSlash(urlOrPath) {
	if (urlOrPath.search('file://') > 0 && urlOrPath[urlOrPath.length - 1] !== '/') {
		return urlOrPath += '/';
	}
	if (urlOrPath[urlOrPath.length - 1] !== '\\') {
		return urlOrPath += '\\';
	}
	return urlOrPath;
}

function log(output) {
	window.console.log(output);
}