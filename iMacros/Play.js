var STOP_ON_ERROR = false;
var PAUSE_ON_ERROR = false;
var PLAY_SPEED = 'fast'; // values: 'fast', 'medium', 'slow'
var PAUSE_ON_EACH_LINE = false; // insert PAUSE macro line on each generated line
var globalMacros = '';

function playMacro(macros) {
	log('Generated macro: \n' + macros);
	var startTime = new Date();
	var macroLines = macros.split('\n');
	for (var i in macroLines) {
		if (interupScriptExecution) {
			return;
		}
		if (macroLines[i] !== '' && macroLines[i] !== '\n') {
			waitWhileProcessing();
			var macrosBlock = createMacrosBlockForRun(macroLines[i]);
			var retCode = iimPlayCode(macrosBlock);
			checkReturnedCode(retCode);
		}
	}
	showDiffTime(startTime);
	globalMacros = '';
}

function createMacrosBlockForRun(macro) {
	var macrosBlock = macro + '\n';
	macrosBlock = setPlaySpeed(macrosBlock);
	if (typeof(PAUSE_ON_EACH_LINE) !== 'undefined' && PAUSE_ON_EACH_LINE === true) {
		macrosBlock += 'PAUSE' + '\n';
	}
	return macrosBlock;
}

function setPlaySpeed(macrosBlock) {
	// by default speed is fast
	if (typeof(PLAY_SPEED) !== 'undefined') {
		if (PLAY_SPEED.toLowerCase() == 'medium') {
			macrosBlock = 'SET !REPLAYSPEED MEDIUM \n' + macrosBlock;
		} else if (PLAY_SPEED.toLowerCase() === 'slow') {
			macrosBlock = 'SET !REPLAYSPEED SLOW \n' + macrosBlock;
		}
	}
	return macrosBlock;
}

function waitWhileProcessing() {
	// wait while shows processing image
	var ajaxStatusElement = content.document.getElementById('ajaxStatus');
	if (ajaxStatusElement !== null) {
		while (ajaxStatusElement.innerHTML == 'on') {
			var retCode = iimPlayCode('WAIT SECONDS=0.2' + '\n');
			checkReturnedCode(retCode);
		}
	}
}

function checkReturnedCode(retCode) {
	err_message = iimGetErrorText();
	if (retCode < 0) {
		// 1330	TIMEOUT_PAGE was reached before the page finished loading.
		if ((retCode == -1330) || (retCode == -802)) {
			iimDisplay(err_message);
			retCode = iimPlayCode('WAIT SECONDS = 3' + '\n');
			checkReturnedCode(retCode);
		} else
		// Stop script then user click stop button
		if (retCode == -101) {
			iimClose();
			interupScriptExecution = true;
			globalMacros = '';
		} else {
			log('ERROR code: ' + retCode + '\nMessage: ' + err_message);
			pauseOrStopExecution(retCode, err_message);
		}
	}
}

function pauseOrStopExecution(retCode, err_message) {
	// Stop script then, retCode < 0 and stop on error = true
	if (STOP_ON_ERROR) {
		// Shows message with details about error or element
		iimClose();
		iimDisplay(err_message);
		log(err_message);
	}
	// Pause script when get error
	if (PAUSE_ON_ERROR) {
		// Shows message with details about error or element
		iimDisplay(err_message);
		retCode = iimPlayCode('PAUSE' + '\n');
		checkReturnedCode(retCode);
	}
}

function showDiffTime(startTime) {
	// Show message; Script finished with run time
	var finishTime = new Date();
	var diffTime = finishTime - startTime;
	log('Script execution finished in time: ' + diffTime + ' miliseconds');
}