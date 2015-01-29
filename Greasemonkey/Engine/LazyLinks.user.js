// ==UserScript==
// @name        LazyLinks_Engine
// @description LazyLinks Engine
// @namespace   LazyLinks
// @grant       GM_info
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @include     http://*/ipb-app*/*
// @updateURL   https://jkundra/lazylinks/Greasemonkey/engine/LazyLinks.meta.js
// @downloadURL	https://jkundra/lazylinks/Greasemonkey/engine/LazyLinks.user.js
// 
// /* LazyLinks Engine Scripts*/
// @resource    engine  http://jkundra/lazylinks/Greasemonkey/Engine/InjectLazyLinks.js
// @resource    ajax    http://jkundra/lazylinks/Greasemonkey/Engine/AjaxCatcher.js
// @resource    cookies http://jkundra/lazylinks/Greasemonkey/Engine/Cookies.js
// ==/UserScript==

injectScript(GM_getResourceText('engine'));
injectScript(GM_getResourceText('ajax'));
injectScript(GM_getResourceText('cookies'));

function injectScript(scriptSource) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.text = scriptSource;

	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);
	// document.body.appendChild(script);
};

/**
 * Global LazyLinks style
 */
GM_addStyle('.LazyLink { color: grey; 	} ');

/**
 * Manage LazyLinks debug mode
 */
unsafeWindow.DEBUG_MODE = GM_getValue('DEBUG_MODE', false);
GM_registerMenuCommand('LazyLinks DEBUG_MODE = ' + GM_getValue('DEBUG_MODE', false) + ', click here to switch', function() {
	GM_setValue('DEBUG_MODE', !GM_getValue('DEBUG_MODE', false)); // Invert value on each call
	console.log('LazyLinks DEBUG_MODE value changed to: ' + GM_getValue('DEBUG_MODE'));
});