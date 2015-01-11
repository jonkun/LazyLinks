/**
 * Bookmark example
 *
 * Add this source to bookmark 'Location:' field.
 */
var urlPrefix = 'file:///d:/exigen/src/LazyLinks/';
javascript: (function() {
	var targetScript = urlPrefix + 'Scripts/EIS/Benefits/CertificatePolicy/DataGather/FillCertificatePolicyDetails.js';
	var targetElement = content.document.getElementById('paramsBroker');
	if (typeof(targetElement) == 'undefined' || targetElement === null) {
		var input = content.document.createElement('input');
		input.setAttribute('id', 'paramsBroker');
		input.setAttribute('type', 'hidden');
		input.setAttribute('value', targetScript);
		content.document.body.appendChild(input);
	} else {
		targetElement.setAttribute('value', targetScript);
	}
	window.location = 'imacros://run/?m=Proxy.js';
}());