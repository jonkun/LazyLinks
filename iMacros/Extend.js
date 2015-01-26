/**
 * Extends each property loaded from json file
 * @param  {String} macrosFromJson macros loaded from json file
 * @return {Object}                extended object
 */
function extendMacro(macrosFromJson) {
	// log(macrosFromJson);
	for (var propertyName in macrosFromJson) {
		// log("propertyName: " + propertyName + ', typeof: ' + typeof(macrosFromJson[propertyName]));
		if (typeof(macrosFromJson[propertyName]) === 'object') {
			// Extend subobjects
			extendMacro(macrosFromJson[propertyName]);
		} else {
			var currentLine = macrosFromJson[propertyName];
			macrosFromJson[propertyName] = {
				macroLine: currentLine,
				value: function(value) {
					playMacro(this.macroLine, value);
					return macrosFromJson;
				},
				selectByIndex: function(index) {
					playMacro(this.macroLine, "#" + index);
					return macrosFromJson;
				},
				selectByCode: function(code) {
					playMacro(this.macroLine, "%" + code);
					return macrosFromJson;
				},
				selectByText: function(text) {
					playMacro(this.macroLine, "$" + text);
					return macrosFromJson;
				},
				/**
				 * Click on element
				 * @param  {String} value table row index
				 */
				click: function(tableRowIndex) {
					playMacro(this.macroLine, tableRowIndex);
					return macrosFromJson;
				},
				/**
				 * Saves value to given variable name
				 * Note:
				 * 	Play engine playing macros lines separately, one by one
				 *  that is reason why macros commands: SET and EXTRACT not works.
				 *  To solve that problem please use functions: 'saveToVar' and 'valueFromVar'
				 */
				saveToVar: function(varName) {
					if (typeof(varName) === 'undefined') {
						logError('Couldn\'t save variable! Property name: ' + propertyName);
					}
					var line = this.macroLine.replace('CONTENT=', '').replace(/FORM.*ATTR/, 'ATTR');
					playMacro(line + '{{SAVE_TO:' + varName + '}}');
					return macrosFromJson;
				},
				/**
				 * Replace variable name to value on macroline
				 */
				valueFromVar: function(varName) {
					if (typeof(varName) === 'undefined') {
						logError('Couldn\'t get variable! Property name: ' + propertyName);
					}
					playMacro(this.macroLine + '{{VALUE_FROM:' + varName + '}}');
					return macrosFromJson;
				}
			};
		}
	}
	// log("JavaScript object properties has been extended");
	return macrosFromJson;
}