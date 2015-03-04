/**
 * Injects LazyLinks data sets to web page
 *
 * @author Jonas Kundra
 * @created 2014-11-12
 */

var DEBUG_MODE = false; // TRUE = shows all logs, FALSE = shows only errors 

var linksTextPrefix = "";
var targetScriptUrlPrefix = '';
var TAG = "";
var elementsWaitingForAjaxDataSet = [];

createParametersBroker();

/**
 * Injects LazyLinks to web page from given resource file
 * @param  {String} scriptName     greasemonkey script name
 * @param  {String} dataSetName     lazyLinks data set name
 * @param  {String} dataSetContext links resource file
 */
function injectLazyLinks(scriptName, dataSetName, dataSetContext) {
	TAG = scriptName + ' | ' + dataSetName;
	var lazyLinkElements = parseLazyLinksDataSet(dataSetContext);

	// Check data set visibility preconditions
	var LOG_PREFIX = 'DataSet: "' + dataSetName + '"" all links invisible, because ';
	// Check property: showIfUrlContains
	if (!checkPropertyShowIfUrlContains(LOG_PREFIX, lazyLinkElements.showIfUrlContains)) return;
	// Check property: showIfExistIds
	if (!checkPropertyShowIfExistIds(LOG_PREFIX, lazyLinkElements.showIfExistIds)) return;
	// Check property: showIfAllTrue
	if (!checkPropertyShowIfAllTrue(LOG_PREFIX, lazyLinkElements.showIfAllTrue)) return;
	// Check property: showIfAnyTrue
	if (!checkPropertyShowIfAnyTrue(LOG_PREFIX, lazyLinkElements.showIfAnyTrue)) return;
	// Check property: showIfTitleContains
	if (!checkPropertyShowIfTitleContains(LOG_PREFIX, lazyLinkElements.showIfTitleContains)) return;

	injectToPage(lazyLinkElements.links, scriptName);
	removeLinks(lazyLinkElements.removeLinksByIds);
}

/**
 * Parse given resource file context
 * @param  {String} dataSetContext resource file context
 * @return {Array}                 LazyLinks array
 */
function parseLazyLinksDataSet(dataSetContext) {
	var lazyLinkElements = null;
	try {
		eval('lazyLinkElements = ' + dataSetContext);
		if (typeof(lazyLinkElements.linksTextPrefix) !== 'undefined') {
			linksTextPrefix = lazyLinkElements.linksTextPrefix;
		}
		if (typeof(lazyLinkElements.linksDescription) !== 'undefined') {
			linksDescription = lazyLinkElements.linksDescription;
		}
		if (typeof(lazyLinkElements.targetScriptUrlPrefix) !== 'undefined') {
			targetScriptUrlPrefix = lazyLinkElements.targetScriptUrlPrefix;
		}
		targetScriptPrefix = lazyLinkElements.targetScriptPrefix;
	} catch (e) {
		logError("Error on dataset: '" + dataSetContext + "'\n " + e);
	}
	return lazyLinkElements;
}

/**
 * Create LazyLink web element and inserts to web page
 * @param  {Array} lazyLinkElements LazyLinks array
 * @param  {String} scriptName      greasemonkey script name
 */
function injectToPage(lazyLinkElements, scriptName) {
	// elementsWaitingForAjaxDataSet = [];

	log(' ------------------------------ Start LazyLinks injecting, count: ' + lazyLinkElements.length + ' -------------------------------');

	for (var i = 0; i < lazyLinkElements.length; i++) {

		var llElement = lazyLinkElements[i];

		var parentElement = document.getElementById(llElement.parentElementId);

		log(i + 1 + ') ID: ' + llElement.targetScript + ', Text: "' + llElement.linkText + '"');
		log(llElement.targetScript + ' >> parentElementId: ' + llElement.parentElementId);

		if (!hasValidVisabilityConditions(llElement, parentElement)) {

			// log(llElement.targetScript + ' '' + llElement.linkText + '' invisible');
			if (typeof(llElement.createAfterAjax) !== 'undefined' && llElement.createAfterAjax === true) {

				var llElementToCreateAfterAjax = llElement;
				llElementToCreateAfterAjax['TAG'] = TAG;
				llElementToCreateAfterAjax['linksTextPrefix'] = linksTextPrefix;
				llElementToCreateAfterAjax['targetScriptUrlPrefix'] = targetScriptUrlPrefix;

				if (!contains(elementsWaitingForAjaxDataSet, llElementToCreateAfterAjax)) {
					elementsWaitingForAjaxDataSet.push(llElementToCreateAfterAjax);
				} else {
					log('Deleted element by ID: ' + llElement.targetScript);
					var elementToDelete = document.getElementById(llElement.targetScript);
					if (elementToDelete !== null) {
						elementToDelete.parentNode.removeChild(elementToDelete);
					}
				}
			}

		} else {
			log(llElement.targetScript + ', "' + llElement.linkText + '" visible');

			// Replace parent element 
			log(llElement.targetScript + ' type: ' + parentElement.type);
			if (parentElement.type === 'submit' ||
				parentElement.type === 'text' ||
				parentElement.type === 'checkbox' ||
				parentElement.type === 'radio' ||
				parentElement.type === 'select-one') {
				parentElement = parentElement.parentNode;
			}

			// Create link element
			var link = createLink(llElement, llElement.parentElementId, scriptName);

			// Desition of link position
			var insertBeforeParent = llElement.insertBeforeParent;
			log(llElement.targetScript + ', insertBeforeParent: ' + insertBeforeParent);
			if (typeof(insertBeforeParent) === 'undefined' || insertBeforeParent === true) {
				parentElement.insertBefore(link, parentElement.childNodes[0]);
			} else {
				parentElement.appendChild(link);
			}

			// Run on show
			var autoRun = llElement.autoRun;
			// log('autoRun: ' + autoRun);
			if (typeof(autoRun) !== 'undefined' && autoRun === true) {
				log('Script "' + llElement.targetScript + '" automatically started');
				link.click();
			}
		}
	}
	log(' Elements depends on ajax count: ' + elementsWaitingForAjaxDataSet.length);
	log(' ------------------------------------ Injection finished. --------------------------------------------');
}

/**
 * Determinate link should we visible or not
 * @param  {Object} lazyLinkElement LazyLink item
 * @param  {Element} parentElement  HTML web element
 * @return {Boolean}                true - if conditions valid, otherwise false
 */
function hasValidVisabilityConditions(lazyLinkElement, parentElement) {

	var LOG_PREFIX = '"' + lazyLinkElement.linkText + '"" invisible, because ';

	if (typeof(parentElement) === 'undefined' || parentElement === null) {
		log(LOG_PREFIX + 'parentElementId "' + lazyLinkElement.parentElementId + '" not found');
		return false;
	}

	/**
	 * Check visibilityConditions properties
	 */
	var visibilityConditions = lazyLinkElement.visibilityConditions;
	if (typeof(visibilityConditions) === 'undefined') {
		return true;
	}

	// Check property: showIfUrlContains
	if (!checkPropertyShowIfUrlContains(LOG_PREFIX, visibilityConditions.showIfUrlContains)) return false;
	// Check property: showIfExistIds
	if (!checkPropertyShowIfExistIds(LOG_PREFIX, visibilityConditions.showIfExistIds)) return false;
	// Check property: showIfAllTrue
	if (!checkPropertyShowIfAllTrue(LOG_PREFIX, visibilityConditions.showIfAllTrue)) return false;
	// Check property: showIfAnyTrue
	if (!checkPropertyShowIfAnyTrue(LOG_PREFIX, visibilityConditions.showIfAnyTrue)) return false;
	// Check property: showIfTitleContains
	if (!checkPropertyShowIfTitleContains(LOG_PREFIX, visibilityConditions.showIfTitleContains)) return false;

	return true;
}

// Check property: showIfUrlContains
function checkPropertyShowIfUrlContains(LOG_PREFIX, showIfUrlContains) {
	if (typeof(showIfUrlContains) === 'undefined' || showIfUrlContains.length === 0) {
		return true;
	}
	var urls = showIfUrlContains;
	for (var i = 0; i < urls.length; i++) {
		if (window.location.href.match(convertToRegexp(urls[i]))) {
			return true;
		}
	}
	log(LOG_PREFIX + 'current page url not contains "' + urls.join(' or ') + '"');
	return false;
}

// Check property: showIfExistIds
function checkPropertyShowIfExistIds(LOG_PREFIX, showIfExistIds) {
	if (typeof(showIfExistIds) !== 'undefined') {
		var idsMustExists = showIfExistIds;
		for (var i = 0; i < idsMustExists.length; i++) {
			var element = document.getElementById(idsMustExists[i]);
			if (typeof(element) === 'undefined' || element === null) {
				log(LOG_PREFIX + 'current page not contains element with ID: "' + idsMustExists[i] + '"');
				return false;
			}
		}
	}
	return true;
}

// Check property: showIfAllTrue
function checkPropertyShowIfAllTrue(LOG_PREFIX, showIfAllTrue) {
	if (typeof(showIfAllTrue) !== 'undefined') {
		for (var i = 0; i < showIfAllTrue.length; i++) {
			var evalResult = null;
			try {
				evalResult = eval(showIfAllTrue[i]);
			} catch (err) {
				log('Eval error: ' + err + '\nSource: ' + showIfAllTrue[i]);
			}
			log('checkPropertyShowIfAllTrue, eval result: ' + evalResult);
			if (evalResult !== true) {
				log(LOG_PREFIX + 'on tag showIfAllTrue: "' + showIfAllTrue[i] + '" equal FALSE');
				return false;
			}
		}
	}
	return true;
}

// Check property: showIfAnyTrue
function checkPropertyShowIfAnyTrue(LOG_PREFIX, showIfAnyTrue) {
	if (typeof(showIfAnyTrue) !== 'undefined') {
		for (var i = 0; i < showIfAnyTrue.length; i++) {
			var evalResult = null;
			try {
				evalResult = eval(showIfAnyTrue[i]);
			} catch (err) {
				log('Eval error: ' + err + '\nSource: ' + showIfAnyTrue[i]);
			}
			log('evalResult: ' + evalResult);
			if (evalResult === true) {
				return true;
			}
			log(LOG_PREFIX + 'on tag showIfAnyTrue all conditions equal FALSE');
			return false;
		}
	}
	return true;
}

// Check property: showIfTitleContains
function checkPropertyShowIfTitleContains(LOG_PREFIX, showIfTitleContains) {
	if (typeof(showIfTitleContains) === 'undefined' || showIfTitleContains.length === 0) {
		return true;
	}
	for (var i = 0; i < showIfTitleContains.length; i++) {
		var pageTitle = document.getElementsByTagName('title')[0].innerHTML;
		if (pageTitle.match(convertToRegexp(showIfTitleContains[i]))) {
			return true;
		}
	}
	log(LOG_PREFIX + 'current page title not contains "' + showIfTitleContains.join(' or ') + '"');
	return false;
}

/**
 * Creates HTML link element
 * @param  {Object} lazyLinkElement LazyLink element
 * @param  {String} parentElementId Parent element id
 * @param  {String} scriptName      greasemonkey script name
 * @return {Element}                HTML element
 */
function createLink(lazyLinkElement, parentElementId, scriptName) {
	var targetScriptUrl = makeTargetScriptUrl(lazyLinkElement.targetScript);
	var link = document.createElement('a');
	link.setAttribute('onclick', 'document.getElementById("paramsBroker").setAttribute("value", "' + targetScriptUrl + '")');
	link.setAttribute('id', targetScriptUrl);
	link.setAttribute('href', 'imacros://run/?m=Start.js');
	link.setAttribute('title', getformatedTitle(scriptName, targetScriptUrl));
	link.setAttribute('class', 'LazyLink');
	// attributes for AjaxCatcher.js
	link.setAttribute('parentElementId', parentElementId);
	link.setAttribute('insertBeforeParent', lazyLinkElement.insertBeforeParent);
	// link.setAttribute('createAfterAjax', lazyLinkElement.createAfterAjax);
	// log('TEST: ' +  lazyLinkElement.createAfterAjax);
	// newElement['insertPosition'] = getElementNodeIndexOfParent(currentLLElement);

	link.innerHTML = linksTextPrefix + lazyLinkElement.linkText;

	// set style
	if (typeof(lazyLinkElement.style) !== 'undefined') {
		var style = lazyLinkElement.style;
		if (style !== null) {
			link.setAttribute('style', style.toString());
		}
	}
	return link;
}

/**
 * Updates target script url
 * @param  {String} targetScriptUrl target scrip url
 * @return {String}                 updated target script url
 */
function makeTargetScriptUrl(targetScriptUrl) {
	if (targetScriptUrl.substr(0, 4) === "file" || targetScriptUrl.substr(0, 4) === "http") {
		return targetScriptUrl;
	}
	if (typeof(targetScriptUrlPrefix) !== 'undefined' && targetScriptUrlPrefix.length > 0) {
		return targetScriptUrlPrefix + targetScriptUrl;
	}
	return targetScriptUrl.replace(' ', '%20');
}

/**
 * Get formatted title for created LazyLink element
 * @param  {String} scriptName     Greasemonkey script name
 * @param  {String} targetScriptUrl url to target script
 * @return {String}                 formatted title
 */
function getformatedTitle(scriptName, targetScriptUrl) {
	return 'Greasemonkey script name: "' + scriptName + '"\n' +
		'Target Script: "' + targetScriptUrl + '"';
}

/**
 * Creates hidden HTML element and append it to page body
 * This element used as parameters broker
 * Parameters from this element reads Start.js
 */
function createParametersBroker() {
	var element = document.getElementById('paramsBroker');
	if (typeof(element) == 'undefined' || element === null) {
		var input = document.createElement('input');
		input.setAttribute('id', 'paramsBroker');
		input.setAttribute('type', 'hidden');
		input.setAttribute('value', '');
		document.body.appendChild(input);
	}
}

/**
 * Prints text to console then DEBUG_MODE = true
 * @param  {String} text text to show
 */
function log(text) {
	if (DEBUG_MODE) {
		console.log(TAG, text);
	}
}

/**
 * Prints errors to console
 * @param  {String} text text to show
 */
function logError(text) {
	console.error(TAG, text);
}

/**
 * Remove lazyLinks by ids
 * This method allows user replace or add customized LazyLink
 * @param  {Array} lazylinkIds  LazyLinks ids to remove
 */
function removeLinks(lazylinkIds) {
	if (typeof(lazylinkIds) === 'undefined' || lazylinkIds === null) {
		return;
	}
	for (var i in lazylinkIds) {
		if (typeof(lazylinkIds[i]) !== 'undefined' && lazylinkIds[i] !== null) {
			var lazyLinkElement = document.getElementById(lazylinkIds[i]);
			if (typeof(lazyLinkElement) !== 'undefined' && lazyLinkElement !== null) {
				lazyLinkElement.parentNode.removeChild(lazyLinkElement);
				log('Links with id: "' + lazylinkIds[i] + '" has been removed');
			}
		}
	}
}

/**
 * Read value from cookie
 * @param  {String} cname cookie name
 * @return {String}       value
 */
function getCookie(cname) {
	var name = cname + "=";
	var ca = content.document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
	}
	return "";
}

/**
 * Shortest function to get element by id
 * @param  {String} elementId element id
 * @return {HTMLElement}      HTML elemenet
 */
function id(elementId) {
	return document.getElementById(elementId);
}

/**
 * Make case-insensitive regexp
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp}
 *
 * @param  {String} pattern String
 * @return {String}         regexp string
 */
function convertToRegexp(pattern) {
	if (pattern.substring(0, 1) === '*') {
		pattern.substring(1, pattern.length - 2);
	}
	return new RegExp(pattern.replace('.*', '*').replace('*', '.*'), 'gi');
}

function contains(a, obj) {
	for (var i = 0; i < a.length; i++) {
		if (a[i] === obj) {
			return true;
		}
	}
	return false;
}