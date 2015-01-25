l = function(output) {
	window.console.log('asd',output);
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
l(file);
// Note: "file" is an object that implements nsIFile. If you want the
// file system path, use file.path