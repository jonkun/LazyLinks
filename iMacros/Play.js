/**
 * Play *.iim and *.js files
 */
var STOP_ON_ERROR = getProperty(4, true); // Stops script execution when error appear
var PAUSE_ON_ERROR = getProperty(5, true); // Makes pause on script execution when error appear
var PAUSE_ON_EACH_LINE = getProperty(6, true); // Makes pauses on each generated macro line, for debugging
var generatedMacros = ''; // Variable used to store generaded macros

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
	var url = makeFullUrl(fileNameOrUrl);
	var script = loadResource(url);

	try {
		var fileExt = url.split('.').pop();
		switch (fileExt) {
			case 'iim':
				playMacro(script);
				break;
			case 'js':
				var res = eval(script);
				log("Script '" + url + "' evaluation completed");
				playMacro(generatedMacros);
				break;
			default:
				logError('Unexpected file extension "' + fileExt + '"! Supported file extensions: *.iim, *.js');
		}
	} catch (err_message) {
		logError(err_message + "\nOn script: " + url);
		stopScriptExecution = true;
	}
	showDiffTime(startTime);
}

/**
 * Play generated macros script if launched file was *.js
 * Play loaded macros script if launched file was *.iim
 * @param  {String} macros generated or loaded iMacros script
 */
function playMacro(macros) {
	log('Macros: \n' + macros);
	var macroLines = macros.split('\n');
	for (var i in macroLines) {
		if (stopScriptExecution) {
			return;
		}
		if (macroLines[i] !== '' && macroLines[i] !== '\n') {
			waitWhileProcessing();
			var macrosBlock = createMacrosBlockForRun(macroLines[i]);
			var retCode = iimPlayCode(macrosBlock);
			log('Macro code: ' + macrosBlock.substr(0, macrosBlock.length - 1) + ' | Returned code: ' + retCode);
			checkReturnedCode(retCode);
		}
	}
	generatedMacros = '';
}

/**
 * Inserts line ends symbol
 * Inserts pause on each line if #PAUSE_ON_EACH_LINE == true
 * @param  {String} macro macro line
 * @return {String}       updated macro line or lines
 */
function createMacrosBlockForRun(macro) {
	var macrosBlock = macro + '\n';
	if (typeof(PAUSE_ON_EACH_LINE) !== 'undefined' && PAUSE_ON_EACH_LINE === true) {
		macrosBlock += 'PAUSE' + '\n';
	}
	return macrosBlock;
}

/**
 *  Wait while on page shows processing image
 */
function waitWhileProcessing() {
	var ajaxStatusElement = content.document.getElementById('ajaxStatus');
	if (ajaxStatusElement !== null) {
		while (ajaxStatusElement.innerHTML == 'on') {
			var retCode = iimPlayCode('WAIT SECONDS=0.2' + '\n');
			checkReturnedCode(retCode);
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
			generatedMacros = '';
		} else {
			logError(err_message + '\nhttp://wiki.imacros.net/Error_and_Return_Codes ' + 'code: ' + retCode );
			pauseOrStopExecution(retCode, err_message);
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
		log(err_message);
	} else if (PAUSE_ON_ERROR) {
		// Pauses script execution when error appear
		iimDisplay(err_message);
		retCode = iimPlayCode('PAUSE' + '\n');
		checkReturnedCode(retCode);
	}
	// Ignore error and continiue script execution
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

