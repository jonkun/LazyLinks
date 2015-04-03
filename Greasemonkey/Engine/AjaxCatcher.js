/**
 * Ajax catcher - restore LazyLinks after ajax event
 *
 * @author Jonas Kundra
 */

(function() {

	// var DEBUG_MODE = false; // TRUE = shows all logs, FALSE = shows only errors

	var llEelementsToRestore = [];
	var ajaxStatus = document.getElementById('ajaxStatus');
	var hasAjaxFired = false; // Prevent element injection on first page load

	if (ajaxStatus !== null) {
		ajaxStatus.addEventListener('DOMSubtreeModified', ajaxStatusChangeListener, false);
	}

	function ajaxStatusChangeListener() {
		if (ajaxStatus.innerHTML === 'on') {

			log('ajax ON');
			llEelementsToRestore = [];
			llEelementsToRestore = collectLazyLinksElements();
			hasAjaxFired = true;

		} else if (ajaxStatus.innerHTML === '') {

			log('ajax OFF');
			restoreLazyLinkElements(llEelementsToRestore);

			/* Insert links aftar ajax event */
			log('Conditions: ' + hasAjaxFired + ', ' + typeof elementsWaitingForAjaxDataSet + ', ' + elementsWaitingForAjaxDataSet.length);
			if (hasAjaxFired && typeof elementsWaitingForAjaxDataSet !== 'undefined' && elementsWaitingForAjaxDataSet.length !== 0) {

				log('Elements count depends on ajax: ' + elementsWaitingForAjaxDataSet.length);
				for (var i = 0; i < elementsWaitingForAjaxDataSet.length; i++) {

					var llElement = elementsWaitingForAjaxDataSet[i];
					if (typeof llElement !== 'undefined') {
						TAG = llElement.TAG;
						targetScriptUrlPrefix = llElement.targetScriptUrlPrefix;
						linksTextPrefix = llElement.linksTextPrefix;
						injectToPage(elementsWaitingForAjaxDataSet, llElement.scriptName);
						hasAjaxFired = false;
					}
				}
			}
		}
	}

	function collectLazyLinksElements() {

		var htmlElements = document.getElementsByClassName('LazyLink');
		var arr = Array.prototype.slice.call(htmlElements);
		log('Count of elements to save: ' + htmlElements.length);

		return arr;
	}

	function restoreLazyLinkElements(toRestoreElements) {

		log('Count of elements to restore: ' + toRestoreElements.length);
		for (var i = 0; i < toRestoreElements.length; i++) {
			var elementToRestore = toRestoreElements[i];

			if ((elementToRestore.getAttribute('createAfterAjax') !== 'undefined') 
				&& (elementToRestore.getAttribute('createAfterAjax') === 'true')) {
				continue; // skip this element 
			}

			var id = elementToRestore.getAttribute('id');
			var parentId = elementToRestore.getAttribute('parentElementId');
			var parentElement = document.getElementById(parentId);

			if (parentElement !== null) {
				var insertTo = elementToRestore.getAttribute('insertTo');
				insertLinkTo(elementToRestore, parentElement, insertTo);
				log(id + ' Restored element with parentId: ' + parentId);
			}

		}
	}

	function isElementAppended(child) {
		if (child.parentNode.innerHTML[0] !== '<') {
			return true;
		}
		return false;
	}

	function getElementNodeIndexOfParent(child) {
		var parent = child.parentNode;
		var index = Array.prototype.indexOf.call(parent.children, child);
		return index;
	}


	/**
	 * Prints text to console then DEBUG_MODE = true
	 * @param  {String} text text to show
	 */
	function log(text) {
		if (DEBUG_MODE) {
			console.log('AjaxCatcher.js', text);
		}
	}

	/**
	 * Prints errors to console
	 * @param  {String} text text to show
	 */
	function logError(text) {
		console.error('AjaxCatcher.js', text);
	}
})();