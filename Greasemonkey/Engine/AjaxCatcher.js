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
				// window.console.log(elementsWaitingForAjaxDataSet);
				var llElement = elementsWaitingForAjaxDataSet[1];
				TAG = llElement.TAG;
				targetScriptUrlPrefix = llElement.targetScriptUrlPrefix;
				linksTextPrefix = llElement.linksTextPrefix;
				injectToPage(elementsWaitingForAjaxDataSet);
				hasAjaxFired = false;
			}
		}
	}

	function collectLazyLinksElements() {
		var newllEelements = []
		var htmlElements = document.getElementsByClassName('LazyLink');
		log('Count of elements to save: ' + htmlElements.length);
		for (var i in htmlElements) {
			var newElement = {};
			newElement['element'] = htmlElements[i];
			newllEelements.push(newElement);
			/**
			 * If this line will be uncomment will got error:
			 * "TypeError: elementToRestore.getAttribute is not a function"
			 */
			// log('Saved element with id: ' + htmlElements[i].getAttribute('id'));
		}
		return newllEelements;
	}

	function restoreLazyLinkElements(toRestoreElements) {

		// toRestoreElements.length > 3 ?
		// 	log('Count of elements to restore: ' + (toRestoreElements.length - 3)) :
		// 	log('Count of elements to restore: ' + toRestoreElements.length);
		log('Count of elements to restore: ' + toRestoreElements.length);

		log(llEelementsToRestore);
		for (var i = toRestoreElements.length - 1; i >= 0; i--) {
			var elementToRestore = toRestoreElements[i].element;
			if (elementToRestore instanceof Element) {
				var id = elementToRestore.getAttribute('id');
				var parentId = elementToRestore.getAttribute('parentElementId');
				var parentElement = document.getElementById(parentId);
				if (parentElement.type === 'submit' ||
					parentElement.type === 'text' ||
					parentElement.type === 'checkbox' ||
					parentElement.type === 'radio' ||
					parentElement.type === 'select-one') {
					parentElement = parentElement.parentNode;
				}
				if (parentElement !== null) {
					var insertBeforeParent = elementToRestore.getAttribute('insertBeforeParent');
					log(id + ' insertBeforeParent: ' + insertBeforeParent);
					if (insertBeforeParent === 'undefined' || insertBeforeParent === "true") {
						parentElement.insertBefore(elementToRestore, parentElement.childNodes[0]);
						log(id + ' Inserted');
					} else {
						parentElement.appendChild(elementToRestore);
						log(id + ' Appended');
					}
					log(id + ' Restored element with parentId: ' + parentId);
				}
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