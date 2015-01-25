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
				addMacro(this.macroLine, value);
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
			 *  To solve that problem please use functions: 'saveToVar' and 'valueFromVar'
			 */
			saveToVar: function(varName) {
				if (typeof(varName) === 'undefined') {
					logError('Couldn\'t save variable! Property name: ' + propertyName);
				}
				var line = this.macroLine.replace('CONTENT=', '').replace(/FORM.*ATTR/, 'ATTR');
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
		if (isFunction(value)) {
			// generatedMacros += macro + 
		} else {
			value = String(value).split(' ').join('<SP>');
			generatedMacros += macro + value + '\n';
		}
	} else {
		generatedMacros += macro + '\n';
	}

}

function functionName(functionDefinition) {
	var ret = functionDefinition.toString();
	ret = ret.substr('function '.length);
	ret = ret.substr(0, ret.indexOf('('));
	return ret;
}

/**
 * Add script to macros this script will be executed on script execution time
 * Example:
 * 		function test() {alert('OK');}
 *   	addScript(test); 	// Works, function will be called on script execution
 *    	addScript(test());	// Not works correctly, function will be called on script initiation
 * Limitations:
 * 		function maxmimum length 2000 characters
 * @param {Object} functionDefinition function definition
 */
// function addScriptToUrl(functionDefinition) {
// 	var entire = functionDefinition.toString();
// 	var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"))
// 	body = body.replace(/(\r\n|\r|\n|\t)/gm,'');
// 	addMacro('url goto=javascript:' + body);
// }

// function addScript(functionDefinition) {
// 	var entire = '(' + functionDefinition.toString() + ')();';
// 	entire = entire.replace(/(\r\n|\r|\n|\t)/gm, '');
// 	addMacro('javascript:' + entire);
// }

function addScript(functionDefinition) {
	var entire = functionDefinition.toString();
	entire = entire.replace(/(\r\n|\r|\n|\t)/gm, '');
	addMacro(entire);
}

function getScript(functionDefinition) {
	var body = '(function() { ' + getScriptBody(functionDefinition) + '})();';
	addMacro('javascript:' + body + functionName(functionDefinition));
}

function getScriptBody(functionDefinition) {
	var entire = functionDefinition.toString();
	var body = entire.substring(entire.indexOf("{") + 1, entire.lastIndexOf("}"))
	body = body.replace(/(\r\n|\r|\n|\t)/gm, '');
	return body;
}

function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}