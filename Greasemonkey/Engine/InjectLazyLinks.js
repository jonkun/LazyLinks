/**
 * Injects LazyLinks to web page
 *
 * @author Jonas Kundra
 * @created 2014-11-12
 */

var DEBUG_MODE = false; // TRUE = shows all logs, FALSE = shows only errors 

var linksTextPrefix = "";
var targetScriptUrlPrefix = '';
var TAG = "";

createParametersBroker();

/**
 * Injects LazyLinks to web page from given resource file
 * @param  {String} scriptName     greasemonkey script name
 * @param  {String} dataSetName     lazyLinks data set name
 * @param  {String} dataSetContext links resource file
 */
function injectLazyLinks(scriptName, dataSetName, dataSetContext) {
	TAG = scriptName + ' | ' + dataSetName + ' | ';
	var lazyLinkElements = parseLazyLinksDataSet(dataSetContext);
	if (isValidUrl(lazyLinkElements.showIfUrlContains)) {
		injectToPage(lazyLinkElements.links, scriptName);
		removeLinks(lazyLinkElements.removeLinksByIds);
	}
}

/**
 * Determinate is valid url
 * @param  {Array}  showIfUrlContains strings which must be in  url
 * @return {Boolean}                  is valid url
 */
function isValidUrl(showIfUrlContains) {
	if (typeof(showIfUrlContains) === 'undefined' || showIfUrlContains === null) {
		return true;
	}
	if (showIfUrlContains.length === 0) {
		return true;
	}
	var url = window.location.toString();
	for (var i in showIfUrlContains) {
		if (typeof(showIfUrlContains[i]) !== 'undefined' && showIfUrlContains[i] !== null) {
			if (url.search(showIfUrlContains[i]) > -1) {
				return true;
			}
		}
	}
	log('Not shows links, because url not contains: "' + showIfUrlContains.join(' or ') + '"');
	return false;
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
	log('Start creating LazyLinks array, count: ' + lazyLinkElements.length);

	for (var i = 0; i < lazyLinkElements.length; i++) {

		var llElement = lazyLinkElements[i];

		for (var p = 0; p < llElement.parentElementIds.length; p++) {
			var parentElement = document.getElementById(llElement.parentElementIds[p]);

			log(i + 1 + ' ' + llElement.targetScript + ' >> Text: "' + llElement.linkText + '"');
			log(llElement.targetScript + ' >> parentElementIds[' + p + 1 + ']: ' + llElement.parentElementIds[p]);

			if (!hasValidVisabilityConditions(llElement, parentElement, llElement.parentElementIds[p])) {
				// log(llElement.targetScript + ' '' + llElement.linkText + '' invisible');
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
				var link = createLink(llElement, llElement.parentElementIds[p], scriptName);

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
	}

	log('LazyLinks array created.');
}

/**
 * Determinate link should we visible or not
 * @param  {Object} lazyLinkElement LazyLink item
 * @param  {Element} parentElement  HTML web element
 * @return {Boolean}                true - if conditions valid, otherwise false
 */
function hasValidVisabilityConditions(lazyLinkElement, parentElement, parentElementId) {

	var LOG_PREFIX = '"' + lazyLinkElement.linkText + '"" invisible, because ';

	if (typeof(parentElement) === 'undefined' || parentElement === null) {
		log(LOG_PREFIX + 'parentElementId "' + parentElementId + '" not found');
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
	var showIfUrlContains = visibilityConditions.showIfUrlContains;
	if (typeof(showIfUrlContains) !== 'undefined') {
		var urls = visibilityConditions.showIfUrlContains;
		var hasUrlContainsAnyText = false;
		for (var i = 0; i < urls.length; i++) {
			if (window.location.href.indexOf(urls[i]) >= 0) {
				hasUrlContainsAnyText = true;
			}
		}
		if (hasUrlContainsAnyText === false) {
			log(LOG_PREFIX + 'current page url not contains "' + urls[i] + '"');
			return false;
		}
	}

	// Check property: showIfExistIds
	if (typeof(visibilityConditions.showIfExistIds) !== 'undefined') {
		var idsMustExists = visibilityConditions.showIfExistIds;
		for (var i = 0; i < idsMustExists.length; i++) {
			var element = document.getElementById(idsMustExists[i]);
			if (typeof(element) === 'undefined' || element === null) {
				log(LOG_PREFIX + 'current page not contains element with ID: "' + idsMustExists[i] + '"');
				return false;
			}
		}
	}

	// Check property: showIfAllTrue
	if (typeof(visibilityConditions.showIfAllTrue) !== 'undefined') {
		var showIfAllTrue = visibilityConditions.showIfAllTrue;
		for (var i = 0; i < showIfAllTrue.length; i++) {
			var evalResult = null;
			try {
				evalResult = eval(showIfAllTrue[i]);
			} catch (err) {
				log('Eval error: ' + err + '\nSource: ' + showIfAllTrue[i]);
			}
			log('evalResult: ' + evalResult);
			if (evalResult !== true) {
				log(LOG_PREFIX + 'on tag showIfAllTrue: "' + showIfAllTrue[i] + '" equal FALSE');
				return false;
			}
		}
	}

	// Check property: showIfAnyTrue
	if (typeof(visibilityConditions.showIfAnyTrue) !== 'undefined') {
		var showIfAnyTrue = visibilityConditions.showIfAnyTrue;
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
	return targetScriptUrl;
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
		console.log(TAG + text);
	}
}

/**
 * Prints errors to console
 * @param  {String} text text to show
 */
function logError(text) {
	console.error(TAG + text);
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