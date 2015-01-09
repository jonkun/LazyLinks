/**
 * Bookmark example
 *
 * Add this source to bookmark 'Location:' field.
 */

javascript: (function() {
	var targetScript = 'EIS/login/LoginAsQa.js';
	var targetElement = content.document.getElementById('targetScript');
	if (typeof(targetElement) == 'undefined' || targetElement === null) {
		var input = content.document.createElement('input');
		input.setAttribute('id', 'targetScript');
		input.setAttribute('type', 'hidden');
		input.setAttribute('value', targetScript);
		content.document.body.appendChild(input);
	} else {
		targetElement.setAttribute('value', targetScript);
	}
	window.location = 'imacros://run/?m=Proxy.js';
}());