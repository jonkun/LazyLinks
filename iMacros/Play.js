/* @ignore */
var rootScriptPath = ''; // Path to root (target) script 

/**
 * Play given iMacros (*.iim) or java script (*.js) file
 *
 * @since 1.0.0
 * @param  {String} fileNameOrUrl file name or full path
 * @see {@link Player.play}
 */
function play(fileNameOrUrl) {
    player.play(fileNameOrUrl);
}

/**
 * Play iMacros script loaded from *.iim file or generated
 *
 * @since 1.0.0
 * @param  {String} macros imacros code lines or one line
 * @param  {String} value  value will be added to line end
 * @see {@link Player.playMacro}
 */
function playMacro(macros, value) {
    var splitedMacros = macros.split('\n');
    for (var i in splitedMacros) {
        var macroLine = splitedMacros[i];
        player.playMacroLine(macroLine, value);
    }
}

/**
 * Import java script and apply to global scope
 *
 * @since 1.0.0
 * @param  {String} fileNameOrUrl  java script file name or full path
 * @see {@link Player.include}
 */
function include(fileNameOrUrl) {
    player.include(fileNameOrUrl);
}

/**
 * Imports file and convert to javascript object
 *
 * @since 1.0.0
 * @param  {String} fileNameOrUrl  json file name or full path
 * @return {Object}                java script object
 * @see {@link Player.load}
 */
function load(fileNameOrUrl) {
    return player.load(fileNameOrUrl);
}

/**
 * Import macros json file and extend it using @see {@link LLElement}
 *
 * @since 1.0.0
 * @param  {String} macrosJsonNameOrUrl json file name of full path
 * @return {LLMacros}                   java script object with tranformed all lines to @see {@link LLElement}'s
 * @see {@link Player.macros}
 */
function macros(macrosJsonNameOrUrl) {
    return player.macros(macrosJsonNameOrUrl);
}

/**
 * Return a parameter value from the target script URL parameters
 *
 * @since 1.0.0
 * @param  {String} paramName    parameter name
 * @param  {Object} defaultValue retunr default value if prameter not exists
 * @return {String}              return a parameter value from the current URL
 * @see {@link Player.getUrlParam}
 */
function getUrlParam(paramName, defaultValue) {
    return player.getUrlParam(paramName, defaultValue);
}

/**
 * Play *.iim and *.js files
 *
 * @class Player
 */
function Player() {

    var scriptUrlInExecution = ''; // Currently on execution script url 
    var extractedVariables = []; // Store extracted variable names and values
    var targetScriptParams = ''; // Store url parameters
    var stopScriptExecution = false; // Stop script execution when user clicks on Stop button where is imacros panel

    /**
     * Play given iMacros (*.iim) or java script (*.js) file
     *
     * @name play
     * @memberof Player
     * @function play
     * @param  {String} fileNameOrUrl file name or full path
     */
    this.play = function(fileNameOrUrl) {
        if (typeof fileNameOrUrl === 'undefined') throw new Error('Illegal argument exception, fileNameOrUrl is undefined!');

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
        if (script === 'undefined' || script === '' || script.match('Error 404') || script.match('DOCTYPE') || script.match('Not Found')) {
            return; // Stop script execution and Error meessage shows loadResource() function
        }

        try {
            var fileExt = url.split('.').pop();
            switch (fileExt) {
                case 'iim':
                    playMacro(script);
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
     * Play iMacros code line
     *
     * @memberOf Player
     * @function playMacroLine
     * @param  {String}  macroLine one imacros code line
     * @param  {String}  value     value will be added to line end
     * @return {Integer}           returned code
     */
    this.playMacroLine = function(macroLine, value) {
        if (stopScriptExecution) return;
        if (macroLine === '' || macroLine === '\n' || macroLine[0] === '\'') return 1;

        var retCode = 1;

        macroLine = macroLine.replace('CODE:', '');
        // Append line by given value
        if (typeof(value) !== 'undefined' && value !== null && value !== '') {
            macroLine += String(value).split(' ').join('<SP>');
        }

        logStyled('Play macro: ' + macroLine);
        retCode = iimPlayCode(macroLine);
        logStyled('Returned code: ' + retCode);
        checkReturnedCode(retCode);

        if (retCode != -802) {
            waitWhileProcessing();
        }

        return retCode;
    }

    /**
     *  Wait while page shows processing image
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
     *
     * @param  {Number} retCode returned code
     */
    function checkReturnedCode(retCode) {
        if (retCode === 1) {
            return; // OK
        }
        var err_message = iimGetErrorText();
        switch (retCode) {
            case -1330:
                // 1330	TIMEOUT_PAGE was reached before the page finished loading.
                iimDisplay(err_message);
                retCode = iimPlayCode('WAIT SECONDS = 3' + '\n');
                checkReturnedCode(retCode);
                logError(err_message);
                break;
            case -933:
                // Stop script execution on network error appears.
                stopScriptExecution = true;
                iimClose();
                break;
            case -802:
                // -802 Timeout error (failed to load web page) 
                // pauseOrStopExecution(retCode, scriptUrlInExecution + '\n' + err_message + '\nhttp://wiki.imacros.net/Error_and_Return_Codes ' + 'code: ' + retCode);
                // iimPlayCode('PAUSE' + '\n');
                // stopScriptExecution = true;
                // iimPlayCode('SET !ERRORIGNORE YES' + '\n');
                break;
            case -101:
                // Stop script then user click stop button
                log('User pressed Stop button');
                stopScriptExecution = true;
                break;
            default:
                pauseOrStopExecution(retCode, scriptUrlInExecution + '\n' + err_message + '\nhttp://wiki.imacros.net/Error_and_Return_Codes ' + 'code: ' + retCode);
        }
    }

    /**
     * Check returned imacros code and makes decision:
     * 	- Stops script execution when error appear OR
     * 	- Pauses script execution when error appear OR
     * 	- Ignore error and continiue script execution
     *
     * @param  {Number} retCode     imacros returned code
     * @param  {String} err_message error message
     */
    function pauseOrStopExecution(retCode, err_message) {
        if (config.stopOnError) {
            // Stops script execution when error appear
            iimDisplay(err_message);
            logError(err_message);
        } else if (config.pauseOnError) {
            // Pauses script execution when error appear
            logError(err_message);
            retCode = iimPlayCode('PAUSE' + '\n');
            checkReturnedCode(retCode);
        }
        // Ignore error and continiue script execution
    }

    /**
     * Update root script path then play subscript
     *
     * @param  {String} targetScriptNameWithPath script with path
     */
    function changeRootScriptPath(fileNameOrUrl) {
        var name = fileNameOrUrl.split('/').pop();
        if (fileNameOrUrl.substr(0, 4) === "file" || fileNameOrUrl.substr(0, 4) === "http") {
            rootScriptPath = fileNameOrUrl.replace(name, '');
        } else {
            if (fileNameOrUrl.substr(0, 2) === "./") {
                rootScriptPath += fileNameOrUrl.replace(name, '');
            } else {
                var subPath = fileNameOrUrl.replace(name, '');
                rootScriptPath = config.scriptsFolder + subPath;
            }
        }
        log("Root path: " + rootScriptPath);
        return './' + name;
    }

    /**
     * Shows time difference between script start time and finish time
     *
     * @param  {Date} startTime script start date and time
     */
    function showDiffTime(startTime) {
        // Show message; Script finished with run time
        var finishTime = new Date();
        var diffTime = finishTime - startTime;
        log('Script "' + scriptUrlInExecution + '" finished in: ' + diffTime / 1000 + ' seconds');
    }

    /**
     * Import java script and apply to global scope
     *
     * @since 1.0.0
     * @memberOf Player
     * @function include
     * @param  {String} fileNameOrUrl  java script file name or full path
     */
    this.include = function(fileNameOrUrl) {
        if (typeof fileNameOrUrl === 'undefined') throw new Error('Illegal argument exception, fileNameOrUrl is undefined!');
        
        var url = makeFullUrl(fileNameOrUrl);
        loadResource(url, true);
    }

    /**
     * Imports file and convert to javascript object
     *
     * @since 1.0.0
     * @memberOf Player
     * @function load
     * @param  {String} fileNameOrUrl  json file name or full path
     * @return {Object}                java script object
     */
    this.load = function(fileNameOrUrl) {
        if (typeof fileNameOrUrl === 'undefined') throw new Error('Illegal argument exception, fileNameOrUrl is undefined!');
        
        var url = makeFullUrl(fileNameOrUrl);
        var scriptAsString = loadResource(url);
        // log("Json resource '" + url + "' import finished");
        return stringToObject(scriptAsString);
    }

    /**
     * Import macros json file and extend it using @see {@link LLElement}
     *
     * @since 1.0.0
     * @memberOf Player
     * @function macros
     * @param  {String} macrosJsonNameOrUrl json file name of full path
     * @return {LLMacros}                   java script object with tranformed all lines to @see {@link LLElement}'s
     */
    this.macros = function(macrosJsonNameOrUrl) {
        if (typeof macrosJsonNameOrUrl === 'undefined') throw new Error('Illegal argument exception, macrosJsonNameOrUrl is undefined!');
        
        var importedJson = load(macrosJsonNameOrUrl);
        var extendedMacros = new LLMacros(importedJson);
        return extendedMacros;
    }

    /**
     * Convert (evaluate) string to java script object
     *
     * @since 1.0.0
     * @memberOf Player
     * @param  {String} string script source
     * @return {Object}        java script object
     */
    function stringToObject(string) {
        if (typeof string === 'undefined') throw new Error('Illegal argument exception, string is undefined!');

        var object;
        eval('object = ' + string);
        // log("Text coverted to JavaScript object");
        return object;
    }

    /**
     * Return a parameter value from the target script URL parameters
     *
     * @since 1.0.0
     * @memberOf Player
     * @function getUrlParam
     * @param  {String} paramName    parameter name
     * @param  {Object} defaultValue retunr default value if prameter not exists
     * @return {String}              return a parameter value from the current URL
     */
    this.getUrlParam = function(paramName, defaultValue) {
        if (typeof paramName === 'undefined') throw new Error('Illegal argument exception, paramName is undefined!');

        log('getUrlParam: ' + targetScriptParams);
        var sval = "";
        var params = targetScriptParams.split("&");
        // split param and value into individual pieces
        for (var i = 0; i < params.length; i++) {
            temp = params[i].split("=");
            if ([temp[0]] == paramName) {
                sval = temp[1];
            }
        }
        if (sval === 'undefined') {
            return defaultValue;
        }
        return sval;
    }

    /**
     * For script or resource loading needs full path until script or resource.
     * If given script or resource path is not in full then it will be changed
     * according to root (target) script path.
     *
     * Example:
     * ----------------------------------------------------------------------------------
     *  Root (target) script path: file://c:/path/to/Scripts/launchedScript.js
     * ----------------------------------------------------------------------------------
     *  fileNameOrUrl                       | returns
     * ----------------------------------------------------------------------------------
     *  file://c:/path/to/Scripts/script.js | file://c:/path/to/Scripts/script.js
     *  http://c:/path/to/Scripts/script.js | http://c:/path/to/Scripts/script.js
     *  ./script.js                         | rootScriptPath +/script.js
     *  ./../json/macros.json               | rootScriptPath + /json/macros.json
     *  /utils/utils.js                     | config.scriptsFolder + /utils/utils.js
     *  utils/utils.js                      | config.scriptsFolder + '/' + utils/utils.js
     *  /utils/utils.js?param=val           | config.scriptsFolder + '/' + utils/utils.js
     *                                      |           and parameters saves to urlParams
     * ----------------------------------------------------------------------------------
     *
     * @since 1.0.0
     * @param  {String} fileNameOrUrl file name or path
     * @return {String}               full path to file
     */
    function makeFullUrl(fileNameOrUrl) {
        if (typeof fileNameOrUrl === 'undefined') throw new Error('Illegal argument exception, fileNameOrUrl is undefined!');

        var url = null;
        // check has url params
        if (fileNameOrUrl.indexOf("?") > -1) {
            targetScriptParams = fileNameOrUrl.split('?')[1];
            fileNameOrUrl = fileNameOrUrl.split('?')[0];
            log('targetScriptParams: ' + targetScriptParams);
        }
        if (fileNameOrUrl.substr(0, 4) === "file" || fileNameOrUrl.substr(0, 4) === "http") {
            url = fileNameOrUrl;
        } else if (fileNameOrUrl[0] === '.') {
            url = rootScriptPath + fileNameOrUrl;
        } else {
            if (fileNameOrUrl[0] === '/') {
                fileNameOrUrl = fileNameOrUrl.substr(1, fileNameOrUrl.length - 1);
            }
            url = config.scriptsFolder + fileNameOrUrl;
        }
        // log('Full url: ' + url);
        return url;
    }

}


/**
 * ------------------------ Replaced iMacros Commands -------------------------
 */

/**
 * Adds wait line to macros
 *
 * @since 1.0.0
 * @see http://wiki.imacros.net/WAIT
 * @param  {Number} sec seconds
 * @param {String} message Show message on iMacros display panel
 */
function wait(sec, message) {
    if (typeof(message) !== 'undefined' && message !== null) {
        iimDisplay(message);
    }
    if (typeof(sec) !== 'undefined' && typeof(sec) === 'number' && sec > 0) {
        playMacro('WAIT SECONDS=' + sec);
    }
}

/**
 * Makes pause on script execution
 * Adds 'PAUSE' macro code to generated macros
 *
 * @since 1.0.0
 * @see http://wiki.imacros.net/PAUSE
 * @param {String} message Show message on iMacros display panel
 */
function pause(message) {
    if (typeof(message) !== 'undefined' && message !== null) {
        iimDisplay(message);
    }
    playMacro('PAUSE');
}

/**
 * Goto given URL
 *
 * @since 1.1.5
 * @see http://wiki.imacros.net/URL
 * @param  {String} url URL Address
 */
function goToUrl(url) {
    if (typeof url === 'undefined') throw new Error('Illegal argument exception, url is undefined!');

    playMacro('URL GOTO=' + url);
}

/**
 * Opens the previously visited website.
 * Has the same effect as clicking the Back button in your browser.
 *
 * @since 1.1.5
 * @see http://wiki.imacros.net/BACK
 */
function back() {
    playMacro('BACK');
}

/**
 * Refreshes (Reloads) current browser window.
 * Refresh includes sending a "pragma:nocache" header to the server (HTTP URLs only)
 * which causes all elements of the website to be reloaded from the webserver.
 *
 * @since 1.1.5
 * @see http://wiki.imacros.net/REFRESH
 */
function refresh() {
    playMacro('REFRESH');
}

/**
 * Clears the browsers cache and all cookies. Can be useful, for example,
 * to delete Web site cookies so every macro run starts at the same point.
 * It is also useful to use this command before doing website response measurements.
 *
 * @since 1.1.5
 * @see http://wiki.imacros.net/CLEAR
 */
function clear() {
    playMacro('CLEAR');
}

/**
 * Sets focus on the tab with number n.
 *
 * @since 1.1.5
 * @see http://wiki.imacros.net/TAB
 * @param numberOrAction TAB (T=n|OPEN|CLOSE|CLOSEALLOTHERS)
 */
function tab(numberOrAction) {
    if (typeof numberOrAction === 'undefined') throw new Error('Illegal argument exception, numberOrAction is undefined!');

    playMacro('TAB T=' + numberOrAction);
}

/**
 * Save page screenhot
 *
 * @since 1.1.5
 * @see saveAs
 */
function screenshot(folder, fileName, fileType) {
    var fileType = fileType;
    if (typeof fileType === 'undefined') {
        fileType = 'PNG';
    } else {
        fileType = fileType.toUpperCase();
    }
    return saveAs(folder, fileName, fileType);
}

/**
 * Saves information to a file.
 *
 * @since 1.1.5
 * @see http://wiki.imacros.net/SAVEAS
 * @param  {String}  folder   Specifies the folder in which the file is saved.
 *                            Use * for the standard download folder specified in the Paths tab of the Options dialog,
 *                            e.g. C:\Program Files\iMacros\downloads\. 
 *
 * @param  {String}  fileName Specifies the file name under which the file is saved.
 *                            If no file extension is given then the default file extension is used.
 *                            If you use FILE=*, the default file name "extract.csv" is used.
 *                            Use +something to add something to the original file name before the file extension.
 *
 * @param  {String}  fileType Specifies the type of the save information. The following options are available:
 *                            TYPE=(CPL|MHT|HTM|TXT|EXTRACT|PNG|JPEG)
 *
 * @return {Integer}          result code OK == 1
 */
function saveAs(folder, fileName, fileType) {
    if (typeof folder === 'undefined') throw new Error('Illegal argument exception, folder is undefined!');
    if (typeof fileName === 'undefined') throw new Error('Illegal argument exception, fileName is undefined!');
    if (typeof fileType === 'undefined') throw new Error('Illegal argument exception, fileType is undefined!');

    return player.playMacroLine('SAVEAS TYPE=' + fileType.toUpperCase() + ' FOLDER=' + folder.replace(/ /g, '<SP>') + ' FILE=' + fileName);
}

/**
 * Deletes the file specified by Name
 *
 * @since 1.1.5
 * @see http://wiki.imacros.net/FILEDELETE
 * @return {Integer}          result code OK == 1
 */
function fileDelete(fileName) {
    if (typeof fileName === 'undefined') throw new Error('Illegal argument exception, fileName is undefined!');

    return player.playMacroLine('FILEDELETE NAME=' + fileName);
}
