/**
 * Bookmark example 
 * 
 * Add this source to bookmark 'Location:' field.
 */
javascript: (function() {
	var targetScript = "EIS/login/LoginAsQa.js";
	content.document.getElementById("targetScript").setAttribute("value", targetScript);
	window.location = 'imacros://run/?m=Proxy.js';
}());