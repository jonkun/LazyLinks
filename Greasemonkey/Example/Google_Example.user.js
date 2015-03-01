// ==UserScript==
// @name        LazyLinks - Google Example
// @description LazyLinks - Google Example
// @namespace   LazyLinks
// @grant       GM_getResourceText
// @grant       GM_info
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @include     http*://*google*
// @icon        https://github.com/jonkun/LazyLinks/raw/master/icons/icon128.png
// @icon64      https://github.com/jonkun/LazyLinks/raw/master/icons/icon64.png
// @updateURL   https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.meta.js
// @downloadURL	https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.user.js
// 
// /* LazyLinks Engine Scripts*/
// @resource    engine  https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Engine/InjectLazyLinks.js
// @resource    ajax    https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Engine/AjaxCatcher.js
//
// /* Links data files */
// @resource    linksDataSet   https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.links.json
// ==/UserScript==

/* LazyLinks Engine Scripts*/
injectScript(GM_getResourceText('engine'));
injectScript(GM_getResourceText('ajax'));

function injectScript(scriptSource) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.text = scriptSource;

	var head = document.getElementsByTagName('head')[0];
	head.appendChild(script);
};

unsafeWindow.DEBUG_MODE = GM_getValue('DEBUG_MODE', false);
GM_registerMenuCommand('LazyLinks DEBUG_MODE = ' + GM_getValue('DEBUG_MODE', false) + ', click here to switch', function() {
	GM_setValue('DEBUG_MODE', !GM_getValue('DEBUG_MODE', false)); // Invert value on each call
	console.log('LazyLinks DEBUG_MODE value changed to: ' + GM_getValue('DEBUG_MODE'));
});

/* Links data set files */
unsafeWindow.injectLazyLinks(GM_info.script.name, 'linksDataSet', GM_getResourceText('linksDataSet'));
