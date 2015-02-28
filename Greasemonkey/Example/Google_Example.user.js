// ==UserScript==
// @name        LazyLinks - Google Example
// @description LazyLinks - Google Example
// @namespace   LazyLinks
// @grant       GM_getResourceText
// @grant       GM_info
// @include     http://*google*
// @icon        http://jkundra/lazylinks/icon128.png
// @icon64      http://jkundra/lazylinks/icon64.png
// @updateURL	https://jkundra/lazylinks/Greasemonkey/Example/Google_Example.meta.js
// @downloadURL	https://jkundra/lazylinks/Greasemonkey/Example/Google_Example.user.js
// 
// /* Links data files */
// @resource    linksDataSet   http://jkundra/lazylinks/Greasemonkey/Example/Google_Example.links.json
// ==/UserScript==

var DEBUG_MODE = false; 	// TRUE = shows all logs, FALSE = shows only errors 

unsafeWindow.injectLazyLinks(GM_getResourceText('linksDataSet'), GM_info.script.name);
