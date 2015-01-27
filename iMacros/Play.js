/**
 * Plays *.iim and *.js files
 */
var STOP_ON_ERROR = false; // Stops script execution when error appear
var PAUSE_ON_ERROR = true; // Makes pause on script execution when error appear
var PAUSE_ON_EACH_LINE = false; // Makes pauses on each generated macro line, for debugging
var scriptUrlInExecution = ''; // Currently on execution script url 
var rootScriptPath = ''; // Path to root (target) script 
var extractedVariables = []; // Store extracted variable names and values
var targetScriptParams = ''; // Store url parameters
var stopScriptExecution = false; // Stop script execution when user clicks on Stop button where is imacros panel

/**
 * Play given iMacros (*.iim) or java script (*.js) file
 * @param  {String} fileNameOrUrl file name or full path
 */
function play(fileNameOrUrl) {
	if (stopScriptExecution) {
		// Stops next script execution then user click STOP button
		return;
	}
	var startTime = new Date();

	// Then script plays another script with full path, root script path must be changed
	// and restored back after subsript finish evaluation
	var masterScriptRootDir = rootScriptPath;
	scriptUrlInExecution = fileNameOrUrl;
	fileNameOrUrl = changeRootScriptPath(fileNameOrUrl);

	var url = makeFullUrl(fileNameOrUrl);
	var script = loadResource(url);

	try {
		var fileExt = url.split('.').pop();
		switch (fileExt) {
			case 'iim':
				playMacros(script);
				break;
			case 'js':
				var scriptAsFunction = new Function(script); // convert string to function
				scriptAsFunction(); // call generated function
				// log(scriptAsFunction());
				break;
			default:
				logError('Incorrect path or file extension "' + fileExt + '"! Supported file extensions: *.iim, *.js');
		}
	} catch (err_message) {
		logError(err_message + "\nOn script: " + scriptUrlInExecution);
		stopScriptExecution = true;
	}
	showDiffTime(startTime);
	// restore master script path
	rootScriptPath = masterScriptRootDir;
}

/**
 * Play loaded macros script *.iim
 * @param  {String} macros generated macros or loaded iMacros script
 */
function playMacros(macros) {
	log('Macros: \n' + macros);
	var macroLines = macros.split('\n');
	for (var i in macroLines) {
		playMacro(macroLines[i]);
	}
}

/**
 * Play imacros script one line
 * @param  {String} macroLine imacros script one line
 * @param  {String} value     value will be added to line end
 */
function playMacro(macroLine, value) {
	if (stopScriptExecution) {
		return;
	}
	if (macroLine !== '' && macroLine !== '\n' && macroLine[0] !== '\'') {
		// Append line by given value
		if (typeof(value) !== 'undefined' && value !== null) {
			macroLine += String(value).split(' ').join('<SP>');
		}
		// Save or Restore variable 
		saveVariable(macroLine);
		macroLine = replaceVariable(macroLine);
		// Play macro line
		waitWhileProcessing();
		log('Play macro: ' + macroLine);
		var retCode = iimPlayCode(macroLine);
		log('Returned code: ' + retCode);
		checkReturnedCode(retCode);
	}
	waitWhileProcessing(); // need double check
	if (PAUSE_ON_EACH_LINE === true) {
		pause();
	}
}

/**
 *  Wait while on page shows processing image
 */
function waitWhileProcessing() {
	var ajaxStatusElement = content.document.getElementById('ajaxStatus');
	if (typeof ajaxStatusElement !== 'undefined' &&
		 ajaxStatusElement !== null && 
		 stopScriptExecution === false) {
		if (ajaxStatusElement.innerHTML == 'on') {
			var retCode = iimPlayCode('WAIT SECONDS=0.2' + '\n');
			checkReturnedCode(retCode);
			waitWhileProcessing();
		}
	}
}

/**
 * Check returned imacros codes
 * Error and Return Codes: http://wiki.imacros.net/Error_and_Return_Codes
 * @param  {Number} retCode returned code
 */
function checkReturnedCode(retCode) {
	if (retCode < 0) {
		var err_message = iimGetErrorText();
		// 1330	TIMEOUT_PAGE was reached before the page finished loading.
		if ((retCode == -1330) || (retCode == -802)) {
			iimDisplay(err_message);
			retCode = iimPlayCode('WAIT SECONDS = 3' + '\n');
			checkReturnedCode(retCode);
		} else
		// Stop script then user click stop button
		if (retCode == -101) {
			iimClose();
			stopScriptExecution = true;
		} else {
			pauseOrStopExecution(retCode, scriptUrlInExecution + '\n' + err_message + '\nhttp://wiki.imacros.net/Error_and_Return_Codes ' + 'code: ' + retCode);
		}
	}
}

/**
 * Check returned imacros code and makes decision:
 * 	- Stops script execution when error appear OR
 * 	- Pauses script execution when error appear OR
 * 	- Ignore error and continiue script execution
 * @param  {Number} retCode     imacros returned code
 * @param  {String} err_message error message
 */
function pauseOrStopExecution(retCode, err_message) {
	if (STOP_ON_ERROR) {
		// Stops script execution when error appear
		iimClose();
		iimDisplay(err_message);
		logError(err_message);
	} else if (PAUSE_ON_ERROR) {
		// Pauses script execution when error appear
		logError(err_message);
		retCode = iimPlayCode('PAUSE' + '\n');
		checkReturnedCode(retCode);
	}
	// Ignore error and continiue script execution
}

/**
 * Saves value to given variable name
 * Note:
 * 	Play engine playing macros lines separately, one by one
 *  that is reason why macros commands: SET and EXTRACT not works
 *  To solve that problem please use functions: 'saveToVar' and 'valueFromVar'
 * @param  {String} macroLine macro line
 */
function saveVariable(macroLine) {
	if (macroLine.search('{{SAVE_TO') > -1) {
		var id = macroLine.match(/ATTR=ID.* /)[0].replace('ATTR=ID:', '').trim();
		var varName = macroLine.match(/\{\{SAVE_TO:.*}}/)[0].replace('{{SAVE_TO:', '').replace('}}', '');
		var value = content.document.getElementById(id).value;
		var newVar = {};
		newVar['name'] = varName;
		newVar['value'] = value;
		extractedVariables.push(newVar);
		log('Extracted value: ' + value + ', from elemenet id: ' + id + ' and saved to: ' + varName);
	}
}

/**
 * Replace variable name to value on macroline
 * @param  {String} macroLine macro line
 * @return {String}           replaced macro line
 */
function replaceVariable(macroLine) {
	if (macroLine.search('{{VALUE_FROM') > -1) {
		var varName = macroLine.match(/\{\{VALUE_FROM:.*}}/)[0].replace('{{VALUE_FROM:', '').replace('}}', '');
		var value = getSavedVariableByName(varName).value;
		macroLine = macroLine.replace(/\{\{VALUE_FROM:.*/, value);
		log('Replaced variable to value: ' + value);
	}
	return macroLine;
}

/**
 * Gets saved object by given variable name
 * @param  {String} varName extracted variable name
 * @return {Object}         saved object with extracted value
 */
function getSavedVariableByName(varName) {
	for (var i in extractedVariables) {
		if (extractedVariables[i].name === varName) {
			return extractedVariables[i];
		}
	}
	logError('Couldn\'t get variable by given name: ' + varName);
}

/**
 * Update root script path then play subscript
 * @param  {String} targetScriptNameWithPath script with path
 */
function changeRootScriptPath(fileNameOrUrl) {
	var name = fileNameOrUrl.split('/').pop();
	if (fileNameOrUrl.substr(0, 4) === "file" || fileNameOrUrl.substr(0, 4) === "http") {
		rootScriptPath = fileNameOrUrl.replace(name, '');
	}
	if (fileNameOrUrl.substr(0, 2) === "./") {
		rootScriptPath += fileNameOrUrl.replace(name, '');
	} else {
		var subPath = fileNameOrUrl.replace(name, '');
		rootScriptPath = config.scriptsFolder + subPath;
	}
	log("Root path: " + rootScriptPath);
	return './' + name;
}

/**
 * Shows time difference between script start time and finish time
 * @param  {Date} startTime script start date and time
 */
function showDiffTime(startTime) {
	// Show message; Script finished with run time
	var finishTime = new Date();
	var diffTime = finishTime - startTime;
	log('Script finished after: ' + diffTime / 1000 + ' seconds');
}

/**
 * Makes pause on script execution
 * Adds 'PAUSE' macro code to generated macros
 * @param {String} message Message shows on macros diplay window
 */
function pause(message) {
	if (typeof(message) !== 'undefined' && message !== null) {
		iimDisplay(message);
	}
	playMacro('PAUSE');
}

/**
 * Adds wait line to macros
 * @param  {Number} sec seconds
 */
function wait(sec) {
	if (typeof(sec) !== 'undefined' && sec > 0) {
		playMacro('WAIT SECONDS=' + sec);
	}
}


/**
 * Stop script execution and show message
 * @param  {String} text message text
 */
function stop(text) {
	logError(text);
	throw new Error(text);
}