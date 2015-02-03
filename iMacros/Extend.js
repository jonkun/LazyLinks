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
				/**
				 * Enter value to field.
				 * Join given arguments to one string and append it to macro line end
				 * Play appended macro line, which sets value(s) to field
				 * 
				 * @since 1.0.0
				 * @param {...value} value(s) will be joined to one string 
				 *                            and appended to macroline end
				 * @return {this}	 Extended macros 
				 */
				value: function(/* value, value, ... */) {
					playMacro(this.macroLine, joinArguments(arguments));
					return macrosFromJson;
				},
				/**
				 * Select value(s) by index.
				 * Join given arguments per '#' symbol to one string and append it to macro line end
				 * Play appended macro line, which selects value(s) on UI field
				 * 
				 * @since 1.0.0
				 * @param {...value} value(s) will be joined to one string 
				 *                            and appended to macroline end
				 * @return {this}	 Extended macros 
				 */
				selectByIndex: function(/* value, value, ... */) {
					playMacro(this.macroLine, joinArguments(arguments, "#"));
					return macrosFromJson;
				},
				/**
				 * Select value(s) by code.
				 * Join given arguments per '%' symbol to one string and append it to macro line end
				 * Play appended macro line, which selects value(s) on UI field
				 * 
				 * @since 1.0.0
				 * @param {...value} value(s) will be joined to one string 
				 *                            and appended to macroline end
				 * @return {this}	 Extended macros 
				 */
				selectByCode: function(/* value, value, ... */) {
					playMacro(this.macroLine, joinArguments(arguments, "%"));
					return macrosFromJson;
				},
				/**
				 * Select value(s) by text.
				 * Join given arguments per '$' symbol to one string and append it to macro line end
				 * 
				 * @since 1.0.0
				 * Play appended macro line, which selects value(s) on UI field
				 * @param {...value} value(s) will be joined to one string 
				 *                            and appended to macroline end
				 * @return {this}	 Extended macros 
				 */
				selectByText: function(/* value, value, ... */) {
					playMacro(this.macroLine, joinArguments(arguments, "$"));
					return macrosFromJson;
				},
				/**
				 * Get selected index from drop-down or listbox
				 * 
				 * @since 1.0.1
				 * @return {Number} selected index
				 */
				getSelectedIndex: function() {
					return this.getElement().selectedIndex;
				},
				/**
				 * Get selected code from drop-down or listbox
				 * 
				 * @since 1.0.1
				 * @return {String} selected value text
				 */
				getSelectedCode: function() {
					return this.getElement().options[this.getSelectedIndex()].value;
				},
				/**
				 * Get selected value from drop-down or listbox
				 * 
				 * @since 1.0.1
				 * @return {String} selected value text
				 */
				getSelectedText: function() {
					return this.getElement().options[this.getSelectedIndex()].text;
				},
				/**
				 * Click on element.
				 * 
				 * @since 1.0.0
				 * @param  {String} table row index
				 * @return {this}	 Extended macros 
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
				 *  
				 * @since 1.0.0
				 * @return {this}	 Extended macros 
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
				 * 
				 * @since 1.0.0
				 * @return {this}	 Extended macros 
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
				/**
				 * Get iMacro line 
				 * 
				 * @since 1.0.0
				 * @return {string} iMacro line
				 */
				getMacro: function() {
					return this.macroLine;
				},
				/**
				 * Get element id
				 * 
				 * @since 1.0.0
				 * @return {String} element id
				 */
				getId: function() {
					return this.macroLine.substr(this.macroLine.indexOf('ATTR=ID:')).replace('ATTR=ID:', '').replace('CONTENT=', '').trim();
				},
				/**
				 * Check is it exists
				 * 
				 * @since 1.0.0
				 * @return {Boolean} true if exists, otherwise return false
				 */
				exists: function() {
					if (id(this.getId()) !== null) {
						return true;
					}
					return false;
				},
				/**
				 * Get HTML Element 
				 * 
				 * @since 1.0.0
				 * @return {HTMLElement} HTMLElement
				 */
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