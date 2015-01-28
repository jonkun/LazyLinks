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
				value: function() {
					playMacro(this.macroLine, joinArguments(arguments));
					return macrosFromJson;
				},
				selectByIndex: function() {
					playMacro(this.macroLine, joinArguments(arguments, "#"));
					return macrosFromJson;
				},
				selectByCode: function() {
					playMacro(this.macroLine, joinArguments(arguments, "%"));
					return macrosFromJson;
				},
				selectByText: function() {
					playMacro(this.macroLine, joinArguments(arguments, "$"));
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
				},
				// ----------------------------------------------------------------------------- 
				//                                Utilities
				// -----------------------------------------------------------------------------
				getId: function() {
					return this.macroLine.substr(this.macroLine.indexOf('ATTR=ID:')).replace('ATTR=ID:', '').replace('CONTENT=', '').trim();;
				},
				exists: function() {
					if (id(this.getId()) !== null) {
						return true;
					}
					return false;
				},
				getElement: function() {
					return id(this.getId());
				}
			};
		}
	}
	// log("JavaScript object properties has been extended");
	return macrosFromJson;
}

/**
 * Recursively concatenating a javascript function arguments
 * @param  {String} separator    separator between arguments
 * @return {String} concatenated arguments
 */
function joinArguments(arguments, separator){
    if (arguments.length === 0) {
        return "";
    }
	if (typeof(separator) === 'undefined') {
		separator = '';
	}
    return separator + Array.prototype.slice.call(arguments).join(':' + separator);
}