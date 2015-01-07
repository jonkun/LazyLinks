function importJson(targetJson) {
	var scriptAsString = loadScript(lazyLinksScriptsHost + targetJson);
	log("Json resource '" + targetJson + "' import finished");
	var object;
	eval('object = ' + scriptAsString);
	log("Json resource has bean coverted to JavaScript object");
	return object;
}

function importMacros(macrosJson) {
	var importedJson = importJson(macrosJson);
	var extendedMacros = extendMacro(importedJson);
	return extendedMacros;
}

function extendMacro(testPageMacros) {
	for (var propertyName in testPageMacros) {
		// log("propertyName: " + propertyName);
		var currentLine = testPageMacros[propertyName];
		testPageMacros[propertyName] = {
			macroLine: currentLine,
			value: function(value) {
				addMacro(this.macroLine, value);
				return testPageMacros;
			},
			selectByIndex: function(index) {
				addMacro(this.macroLine, "#" + index);
				return testPageMacros;
			},
			selectByCode: function(code) {
				addMacro(this.macroLine, "%" + code);
				return testPageMacros;
			},
			selectByText: function(text) {
				addMacro(this.macroLine, "$" + text);
				return testPageMacros;
			},
			click: function() {
				addMacro(this.macroLine, null);
				return testPageMacros;
			}
		};
	}
	log("JavaScript object properties has bean extended");
	return testPageMacros;
}

function addMacro(macro) {
	addMacro(macro, null);
}

function addMacro(macro, value) {
	if (typeof(value) !== 'undefined' && value !== null) {
		value = value.split(" ").join("<SP>");
		globalMacros += macro + value + "\n";
	} else {
		globalMacros += macro + "\n";
	}
}

