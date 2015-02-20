// var DO = function(){

	const Cc = Components.classes;
	const Ci = Components.interfaces;
	const URL = 'http://jkundra/lazylinks/iMacrosEngine/iMacros/';
	// const debugMode = true;
	var llPLayerFiles = ['Start.js', 'Play.js', 'Extend.js', 'Utils.js'];

	if (allFilesExists(llPLayerFiles)) {
		for (var i in llPLayerFiles) {
			var name = llPLayerFiles[i];
			l('File name: ' + name);
			var file = openFile(name);
			var fileContent = readFile(file);
			l(fileContent);
			// var scriptAsFunction = new Function(fileContent);
			// scriptAsFunction();
			// eval.apply(window, [fileContent]);
			
			eval(fileContent);
			log('test');
		}
	} else {
		downloadFiles(llPLayerFiles, false);
	}

	function downloadFiles() {
		for (var i in llPLayerFiles) {
			var name = llPLayerFiles[i];
			var file = openFile(name);
			writeToFile(file, getResource(URL + name));
		}
	}

	function allFilesExists(llPLayerFiles) {
		for (var i in llPLayerFiles) {
			if (!openFile(llPLayerFiles[i]).exists()) {
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

	function openFile(fileName) {
		var file = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).get("ProfD", Ci.nsIFile);
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

	function l(text) {
		window.console.log(text);
	}

// };

// DO();
