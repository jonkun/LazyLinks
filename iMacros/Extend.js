/**
 * Extends each property loaded from json file
 * @param  {String} macrosFromJson macros loaded from json file
 * @return {Object}                extended object
 */
function extendMacro(macrosFromJson) {
	for (var propertyName in macrosFromJson) {
		// log("propertyName: " + propertyName);
		var currentLine = macrosFromJson[propertyName];
		macrosFromJson[propertyName] = {
			macroLine: currentLine,
			value: function(value) {
				addMacro(this.macroLine, String(value));
				return macrosFromJson;
			},
			selectByIndex: function(index) {
				addMacro(this.macroLine, "#" + index);
				return macrosFromJson;
			},
			selectByCode: function(code) {
				addMacro(this.macroLine, "%" + code);
				return macrosFromJson;
			},
			selectByText: function(text) {
				addMacro(this.macroLine, "$" + text);
				return macrosFromJson;
			},
			click: function() {
				addMacro(this.macroLine, null);
				return macrosFromJson;
			},
			/**
			 * Saves value to given variable name
  			 * Note:
  			 * 	Play engine playing macros lines separately, one by one
  			 *  that is reason why macros commands: SET and EXTRACT not works.
  			 *  To solve that problem please use functions: 'saveValueToVar' and 'valueFromVar'
			 */
			saveValueToVar: function(varName) {
				if (typeof(varName) === 'undefined') {
					logError('Couldn\'t save variable! Property name: ' + propertyName);
				}
				var line = this.macroLine.replace('CONTENT=', '');
				var line = line.replace(/FORM.*ATTR/, 'ATTR');
				addMacro(line + '{{SAVE_TO:' + varName + '}}');
				return macrosFromJson;
			},
			/**
	 		 * Replace variable name to value on macroline 
  		     */
			valueFromVar: function(varName) {
				if (typeof(varName) === 'undefined') {
					logError('Couldn\'t get variable! Property name: ' + propertyName);
				}
				addMacro(this.macroLine + '{{VALUE_FROM:' + varName + '}}');
				return macrosFromJson;
			}
		};
	}
	// log("JavaScript object properties has been extended");
	return macrosFromJson;
}

/**
 * Append generatedMacros variable by given macro and value
 * @param {String} macro macro line
 * @param {String} value value of macro line
 */
function addMacro(macro, value) {
	if (typeof(value) !== 'undefined' && value !== null) {
		value = value.split(" ").join("<SP>");
		generatedMacros += macro + value + "\n";
	} else {
		generatedMacros += macro + "\n";
	}
}

