const Cc = Components.classes;
const Cu = Components.utils;
const Ci = Components.interfaces;

l = function(output) {
	window.console.log(output);
}

// var file = Components.classes["@mozilla.org/file/directory_service;1"]
// 	.getService(Components.interfaces.nsIProperties)
// 	.get("ProfD", Components.interfaces.nsIFile);
// file.append("my_db_file_name.sqlite");

// get firefox install path
// alert(Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("CurProcD", Components.interfaces.nsIFile).path);

// alert(Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsILocalFile).get("CurProcD", Components.interfaces.nsIFile).path);
// window.console.log(Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile));
// window.console.log(Components.classes["@mozilla.org/file/local;1"]);

// Get profile directory.
var file = Components.classes["@mozilla.org/file/directory_service;1"].
getService(Components.interfaces.nsIProperties).
get("ProfD", Components.interfaces.nsIFile);
// Or using Services.jsm and Ci = Components.interfaces
// var file = Services.dirsvc.get("ProfD", Components.interfaces.nsIFile);

// Append the file name.
file.append("data.txt");
// l(file);
// Note: "file" is an object that implements nsIFile. If you want the
// file system path, use file.path


// WORKS
// var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
// var mainWindow = wm.getEnumerator("navigator:browser");
// var browserWin = mainWindow.getNext();
// var tabbrowser = browserWin.gBrowser;
// tabbrowser.loadURI("chrome://imacros/content/options.xul");
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var wm = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
var mainWindow = wm.getMostRecentWindow("navigator:browser");
var gBrowser = mainWindow.gBrowser;
// Add tab, then make active
// gBrowser.selectedTab = gBrowser.addTab("chrome://imacros/content/options.xul");
// gBrowser.selectedTab = gBrowser.loadOneTab("chrome://imacros/content/options.xul");
// gBrowser.selectedTab = gBrowser.loadURI("chrome://imacros/content/options.xul");
// gBrowser.selectedTab.addEventListener("load", function () {
// 	window.innerWidth = windowWidth;
// 	window.innerHeight = windowHeight;
// }, false);


// var page = {
// //<![CDATA[
// 	<html>
// //]]>
// }

// content.document.
var document = gBrowser.contentDocument;
var iframe = document.createElement('iframe');
var html = '<body>Foo</body>';
document.body.appendChild(iframe);
iframe.contentWindow.document.open();
iframe.contentWindow.document.write(html);
iframe.contentWindow.document.close();