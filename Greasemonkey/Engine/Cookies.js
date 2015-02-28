/**
 * Cookies utils for LazyLinks
 *
 * @author Jonas Kundra
 */

(function() {

	var DEBUG_MODE = false; // TRUE = shows all logs, FALSE = shows only errors

	var SEARCH_FIELD_ID = 'topQuickSearchForm:request';

	var searchBtn = document.getElementById('topQuickSearchForm:quickSearchBtn');
	var searchField = document.getElementById(SEARCH_FIELD_ID);

	if (searchBtn !== null) {
		searchBtn.addEventListener('click', onClickSearchListener, false);
		searchField.addEventListener('keypress', onEnterSearchListener, false);
		restoreSearchValue();
	}

	function restoreSearchValue() {
		var restoredValue = getCookie('search');
		searchField.value = restoredValue;
		log('Retored value: ' + restoredValue);
	}

	function onEnterSearchListener(event) {
		if (event.keyCode == 13) {
			onClickSearchListener();
		}
	}

	function onClickSearchListener() {
		log('User clicked Search link');
		var searchField = document.getElementById(SEARCH_FIELD_ID);
		if (typeof searchField !== 'undefined') {
			var value = searchField.value;
			if (value !== null && value !== '') {
				setCookie('search', value, 365);
			}
		}
	}

	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
		log('Saved cookie: "' + cname + '" value: "' + cvalue + '" expires: ' + exdays);
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1);
			if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
		}
		return "";
	}



	/**
	 * Prints text to console then DEBUG_MODE = true
	 * @param  {String} text text to show
	 */
	function log(text) {
		if (DEBUG_MODE) {
			console.log('LazyLinks | Cookies.js | ' + text);
		}
	}

	/**
	 * Prints errors to console
	 * @param  {String} text text to show
	 */
	function logError(text) {
		console.error('LazyLinks | Cookies.js | ' + text);
	}

})();