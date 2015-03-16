/**
 * Extends each property loaded from json file
 *
 * @class LLMacros
 * @constructor
 * @since 1.0.0
 * @param  {String} macrosFromJson macros loaded from json file
 * @return {Object}                Extended macros object
 */
function LLMacros(macrosFromJson) {
	this.type = 'LLMacros';
	// log(macrosFromJson);
	for (var propertyIndex in macrosFromJson) {
		// log("propertyIndex: " +p ropertyName + ', typeof: ' + typeof(macrosFromJson[propertyIndex]));
		if (typeof(macrosFromJson[propertyIndex]) === 'object') {
			// Extend subobjects
			LLMacros(macrosFromJson[propertyIndex]);
		} else {
			var currentLine = macrosFromJson[propertyIndex];
			macrosFromJson[propertyIndex] = new LLElement(macrosFromJson, currentLine);
		}
	}
	// log("JavaScript object properties has been extended");
	return macrosFromJson;
}

/**
 * LazyLinks Element class
 *
 * @class LLElement
 * @constructor
 * @since 1.0.0
 * @param {String} macrosFromJson macros file content
 * @param {String} macroLine      macro line
 */
function LLElement(macrosFromJson, macroLine) {
	this.type = 'LLElement';
	this.macrosFromJson = macrosFromJson;
	this.macroLine = macroLine;

	/**
	 * Enter value to field.
	 * Join given arguments to one string and append it to macro line end
	 * Play appended macro line, which sets value(s) to field
	 *
	 * @since 1.0.0
	 * @param {...value} value(s) will be joined to one string
	 *                            and appended to macroline end
	 * @return {Object}           Extended macros object
	 */
	LLElement.prototype.value = function( /* value, value, ... */ ) {
		playMacro(this.macroLine, joinArguments(arguments));
		return this.macrosFromJson;
	};

	/**
	 * Select value(s) by index.
	 * Join given arguments per '#' symbol to one string and append it to macro line end
	 * Play appended macro line, which selects value(s) on UI field
	 *
	 * @since 1.0.0
	 * @param {...String} value(s) will be joined to one string
	 *                            and appended to macroline end
	 * @return {Object}           Extended macros object
	 */
	LLElement.prototype.selectByIndex = function( /* value, value, ... */ ) {
		playMacro(this.macroLine, joinArguments(arguments, "#"));
		return this.macrosFromJson;
	};

	/**
	 * Select value by index or select last option if given index > available options
	 *
	 * @since 1.0.3
	 * @param  {Number} index option index of list-box or drop-down
	 * @return {Object}       Extended macros object
	 */
	LLElement.prototype.selectByIndexOrLast = function(index) {
		playMacro(this.macroLine, getApplicableIndex(this.getElement(), index));
		return this.macrosFromJson;
	};

	/**
	 * Select value(s) by code.
	 * Join given arguments per '%' symbol to one string and append it to macro line end
	 * Play appended macro line, which selects value(s) on UI field
	 *
	 * @since 1.0.0
	 * @param {...String} value(s) will be joined to one string
	 *                             and appended to macroline end
	 * @return {Object}            Extended macros object
	 */
	LLElement.prototype.selectByCode = function( /* value, value, ... */ ) {
		playMacro(this.macroLine, joinArguments(arguments, "%"));
		return this.macrosFromJson;
	};

	/**
	 * Select value(s) by text.
	 * Join given arguments per '$' symbol to one string and append it to macro line end
	 *
	 * @since 1.0.0
	 * Play appended macro line, which selects value(s) on UI field
	 * @param {...String} value(s) will be joined to one string
	 *                             and appended to macroline end
	 * @return {Object}            Extended macros object
	 */
	LLElement.prototype.selectByText = function( /* value, value, ... */ ) {
		playMacro(this.macroLine, joinArguments(arguments, "$"));
		return this.macrosFromJson;
	};

	/**
	 * Get selected index from drop-down or listbox
	 *
	 * @since 1.0.1
	 * @return {Number} selected index
	 */
	LLElement.prototype.getSelectedIndex = function() {
		return this.getElement().selectedIndex;
	};

	/**
	 * Get selected code from drop-down or listbox
	 *
	 * @since 1.0.1
	 * @return {String} selected value text
	 */
	LLElement.prototype.getSelectedCode = function() {
		return this.getElement().options[this.getSelectedIndex()].value;
	};

	/**
	 * Get selected value from drop-down or listbox
	 *
	 * @since 1.0.1
	 * @return {String} selected value text
	 */
	LLElement.prototype.getSelectedText = function() {
		return this.getElement().options[this.getSelectedIndex()].text;
	};

	/**
	 * Click on element.
	 *
	 * @since 1.0.0
	 * @see http://wiki.imacros.net/CLICK
	 * @param  {Number} [index] index of row/link/button on table
	 * @return {Object}        Extended macros object
	 */
	LLElement.prototype.click = function(index) {
		if (typeof index === 'undefined') {
			playMacro(this.macroLine);
		} else if (this.macroLine.match('{{index}}')) {
			playMacro(this.macroLine.replace('{{index}}', index)); // change index in middle of macro line
		} else {
			playMacro(this.macroLine, index); // append index to macro line end
		}
		return this.macrosFromJson;
	};


	/**
	 * Extracts data from element
	 *
	 * @since 1.1.5
	 * @return {String} extracted data
	 */
	LLElement.prototype.extract = function() {
		var macro = this.macroLine.replace(/CONTENT=\S*/g, ''); // replace until first space
		macro += ' EXTRACT=TXT';
		player.playMacroLine(macro);
		return iimGetExtract();
	};

	// ----------------------------------------------------------------------------- 
	//                                Utilities
	// -----------------------------------------------------------------------------
	/**
	 * Get iMacro line
	 *
	 * @since 1.0.0
	 * @return {String} iMacros line
	 */
	LLElement.prototype.getMacro = function() {
		return this.macroLine;
	};

	/**
	 * Get element id
	 *
	 * @since 1.0.0
	 * @return {String} element id
	 */
	LLElement.prototype.getId = function() {
		return this.macroLine.substr(this.macroLine.indexOf('ATTR=ID:')).replace('ATTR=ID:', '').replace('CONTENT=', '').trim();
	};

	/**
	 * Check is it exists
	 *
	 * @since 1.0.0
	 * @return {Boolean} true if exists, otherwise false
	 */
	LLElement.prototype.exists = function() {
		if (id(this.getId()) !== null) {
			return true;
		}
		return false;
	};

	/**
	 * Get HTML Element
	 *
	 * @since 1.0.0
	 * @return {HTMLElement} HTMLElement
	 */
	LLElement.prototype.getElement = function() {
		return id(this.getId());
	};


	/**
	 * Recursively concatenating a javascript function arguments
	 * @param  {Array}  arguments      function arguments
	 * @param  {String} [separator=''] separator between arguments
	 * @return {String}                concatenated arguments
	 */
	function joinArguments(arguments, separator) {
		if (arguments.length === 0) {
			return "";
		}
		if (typeof(separator) === 'undefined') {
			separator = '';
		}
		return separator + Array.prototype.slice.call(arguments).join(':' + separator);
	};

	/**
	 * Checks has given index is not out of range
	 *
	 * @since 1.0.3
	 * @param  {HTMLElement} element HTML Element
	 * @param  {Number} index   drop-down or list-box index
	 * @return {Number}         return given index if it is applicable
	 */
	function getApplicableIndex(element, index) {
		var availableGroupsCount = element.options.length;
		// Increase if given value == 0
		if (index == 0) index++;
		// Increase if first option is empty
		if (element.options[0].value === '') index++;
		// check index is more then available options count
		if (index <= availableGroupsCount) {
			return index;
		}
		return availableGroupsCount;
	};

};

