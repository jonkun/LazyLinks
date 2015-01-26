/**
 * How To:
 * 	- Write to file: 	http://stackoverflow.com/questions/23705970/firefox-extension-write-data-to-file
 * 	- Read from file: 	https://developer.mozilla.org/en-US/Add-ons/Code_snippets/File_I_O
 */

const Cc = Components.classes;
const Ci = Components.interfaces;
// const Cu = Components.utils;

// Create Config file 
var config = {
	// Default values
	"macrosFolder": "file:///c:/path/to/LazyLinks/iMacros/",
	"scriptsFolder": "file:///c:/path/to/LazyLinks/Scripts/",
	"iMacrosEngineUpdateUrl": "http://jkundra/lazylinks/iMacros/",
	"debugMode": false
};
var configAsString = JSON.stringify(config);
log(configAsString);
var file = getFile("LazyLinks_config.json");
writeToFile(file, configAsString);

// Create HTML file
var html = '<html> \
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type"> \
	<meta content="utf-8" http-equiv="encoding">\
	<head><title>LazyLinks Configuration</title></head>\
	<body>\
		<form id="lazylinksConfigForm">\
			<output>iMacros Folder</output>\
			<input id="macrosFolderId" type="text" value="' + config.macrosFolder + '">\
			<br>\
			<output>Scripts Folder</output>\
			<input id="scriptsFolderId" type="text" value="' + config.scriptsFolder + '">\
			<br>\
			<output>iMacros Engine Update URL</output>\
			<input id="updateUrlId" type="text" value="' + config.iMacrosEngineUpdateUrl + '">\
			<br>\
			<button id="button">Save</button> \
		</form>\
	</body>\
</html>';
var fileHtml = getFile("LazyLinks_config.html");
writeToFile(fileHtml, html);
// METHOD 1
// window.location = 'file:///' + fileHtml.path.replace('\', ' / '');
// window.onload = function(){
// 	log('page ready');
// 	alert('asd');
// 	content.document.getElementById('button').addEventListener("click", function() {
// 		log('click');
// 	}, false);
// }

// METHOD 2
var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
var mainWindow = wm.getMostRecentWindow("navigator:browser");
var gBrowser = mainWindow.gBrowser;
// Add tab, then make active
// gBrowser.selectedTab = gBrowser.addTab('file:///' + fileHtml.path.replace('\', '/''));
// gBrowser.selectedTab = gBrowser.loadOneTab('file:///' + fileHtml.path.replace('\', ' / ''));
gBrowser.selectedTab = gBrowser.loadURI('file:///' + fileHtml.path.replace('\', ' / ''));
if (gBrowser.selectedTab.onload === null) {
	gBrowser.selectedTab.onload = function() {
		log('page ready on load');
		var doc = gBrowser.contentDocument;
		doc.getElementById('button').addEventListener("click", function() {
			alert(doc.getElementById('macrosFolderId').value);
		}, false);
		log(gBrowser.contentDocument.getElementById('button'));
	}
}

function getFile(fileName) {
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

// function optionsHTML() {
// 	return 
// }


function log(output) {
	window.console.log(output);
}