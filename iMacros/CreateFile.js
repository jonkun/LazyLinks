const Cc = Components.classes;
const Ci = Components.interfaces;

// Components.utils.import("resource://gre/modules/NetUtil.jsm");
// Components.utils.import("resource://gre/modules/FileUtils.jsm");

var file = openFile('test.txt');
writeToFile(file, 'file content');

l(file);

function openFile(fileName) {
	var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
	file.initWithPath('c:\\');
	file.append(fileName);
	return file;
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

function l(text) {
	window.console.log(text);
}