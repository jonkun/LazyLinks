/**
 * How To:
 * 	- Write to file: 	http://stackoverflow.com/questions/23705970/firefox-extension-write-data-to-file
 * 	- Read from file: 	https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
 */

const Cc = Components.classes;
const Ci = Components.interfaces;
// const Cu = Components.utils;

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
	        .jGrowl .manilla {\
				background: #80FF80;\
				color: #FFFFFF;\
			}\
		</style>\
		<!-- https://github.com/stanlemon/jGrowl -->\
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.min.css" />\
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>\
		<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-jgrowl/1.2.12/jquery.jgrowl.min.js"></script>\
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
						<input id="macrosFolderId" type="text" size="40" value="' + config.macrosFolder.replace('file:///','').replace(/\//g,'\\') + '">\
						<button id="selectMacrosFolderId" class="pure-button">Browse...</button> \
					</div>\
					<div class="pure-control-group">\
						<label for="scriptsFolderId">Scripts Folder or URL</label>\
						<input id="scriptsFolderId" type="text" size="40" value="' + config.scriptsFolder + '">\
						<button id="selectScriptsFolderId" class="pure-button">Browse...</button> \
					</div>\
					<div class="pure-control-group">\
						<label for="updateUrlId">iMacros Engine Update URL</label>\
						<input id="updateUrlId" type="text" size="40" value="' + config.iMacrosEngineUpdateUrl + '">\
					</div>\
					<div class="pure-control-group">\
						<label for="updateUrlId">Debug Mode</label>\
						<input type="radio" name=myradio value="debugModeOn" > On \
						<input type="radio" name=myradio value="debugModeOff" checked > Off \
					</div>\
					<div class="pure-controls">\
						<button id="saveBtn" type="submit" class="pure-button pure-button-primary">Save</button> \
						<a id="cancelBtn" class="pure-button" onclick="$.jGrowl(\'Saved!\', { life: 400, theme:  \'manilla\' });">Cancel</a> \
					</div>\
				</fieldset>\
			</form>\
		</div>\
	</body>\
</html>';


/**
 * Load configuration 
 * if exists configuration file loads from them, overwise
 * 	create file configuration file and loads from them
 * @return {Object} configuration
 */
function loadConfig() {
	var file = openFile("LazyLinks_config.json");
	if (!file.exists()) {
		var configAsString = JSON.stringify(config);
		log('Create defaults configuration file');
		writeToFile(file, configAsString);
	}
	var loadedContent = readFile(file);
	// log(loadedContent);
	return JSON.parse(loadedContent);
}


config = loadConfig();

var fileHtml = openFile("LazyLinks_config.html");
writeToFile(fileHtml, html);

var pathURL = 'file:///' + fileHtml.path.replace(/\\/g, '/');


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
		// alert('on new tab load');
		// your stuff

		doc.getElementById('selectMacrosFolderId').onclick = function() {
			var selectedFolder = showSelectFolderDialog();
			if (selectedFolder != null) {
				config.macrosFolder = selectedFolder;
			}
		};

		doc.getElementById('selectScriptsFolderId').onclick = function() {
			var selectedFolder = showSelectFolderDialog();
			if (selectedFolder != null) {
				config.scriptsFolder = selectedFolder;
			}
		};

		doc.getElementById('saveBtn').onclick = function() {
			// alert(doc.getElementById('macrosFolderId').value);
			// toastr.info('Are you the 6 fingered man?');
		};

		// doc.getElementById('cancelBtn').onclick = function() {
			// alert(doc.getElementById('macrosFolderId').value);
			
			
		// };

	}, true);
}

// METHOD 1
// window.location = pathURL;
// window.onload = function(){
// 	log('page ready');
// 	alert('asd');
// 	content.document.getElementById('button').addEventListener("click", function() {
// 		log('click');
// 	}, false);
// }


// window.popup = window.open(pathURL, 'imacros',
// 	'directories=no, toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=no, top=100, left=350, width=600, height=400');

// window.popup.addEventListener('load', function() {
// 	alert('asd');
// }, false);

// window.popup.onload = function() {
// 	alert("message one ");
// }
// alert("message 1 maybe too soon\n" + window.popup.onload);

// gBrowser.contentDocument.onload = function() {
// 	alert('ad11');
// }

// var popupWindow = window.open(pathURL, 'imacros',
// 	'directories=no, toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=no, top=100, left=350, width=600, height=400');

// popupWindow.addEventListener('load', function() {
// 	alert('asd');
// }, false);

// popupWindow.onload = function() {
// 	alert('asd');
// }

// popupWindow.onload = function() {
// log('page ready');
// alert('done');
// var doc = gBrowser.contentDocument;
// doc.getElementById('button').onclick = function() {
// 	alert(doc.getElementById('macrosFolderId').value);
// };
// doc.getElementById('selectMacrosFolderId').onclick = function() {
// 	alert(showSelectFolderDialog());
// };
// }

// var popupWindow = window.open(pathURL, 'imacros',
// 	'directories=no, toolbar=no, location=no, status=no, menubar=no, scrollbars=no, resizable=no, top=100, left=350, width=600, height=400');
// window.location = pathURL;
// popupWindow.focus();
// alert(popupWindow.onload);

// popupWindow.onload = function() {
// 	log('page ready');
// 	alert('done');
// var doc = gBrowser.contentDocument;
// doc.getElementById('button').onclick = function() {
// 	alert(doc.getElementById('macrosFolderId').value);
// };
// log(gBrowser.contentDocument.getElementById('button'));

// doc.getElementById('selectMacrosFolderId').onclick = function() {
// 	alert(showSelectFolderDialog());
// };
// };
// alert(popupWindow.onload);
// window.open(pathURL);

// Error: Access to  from script denied

// METHOD 2
// var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
// var mainWindow = wm.getMostRecentWindow("navigator:browser");
// var gBrowser = mainWindow.gBrowser;
// // Add tab, then make active
// gBrowser.selectedTab = gBrowser.addTab('file:///' + fileHtml.path.replace('\', ' / ''));
// // gBrowser.selectedTab = gBrowser.loadOneTab('file:///' + fileHtml.path.replace('\', ' / ''));
// gBrowser.selectedTab = gBrowser.loadURI('file:///' + fileHtml.path.replace('\', ' / ''));
// if (gBrowser.selectedTab.onload === null) {
// 	gBrowser.selectedTab.onload = function() {
// 		log('onload');
// 		var doc = gBrowser.contentDocument;
// 		doc.getElementById('button').onclick = function() {
// 			alert(doc.getElementById('macrosFolderId').value);
// 		};
// 		log(gBrowser.contentDocument.getElementById('button'));

// 		// doc.getElementById('selectMacrosFolderId').onclick = function() {
// 		// 	alert(showSelectFolderDialog());
// 		// };

// 	}
// }

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

function log(output) {
	window.console.log(output);
}