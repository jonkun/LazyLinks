// ==UserScript==
// @name        LazyLinks Google Example
// @description LazyLinks Google Example add-on
// @namespace   LazyLinks
// @grant       GM_getResourceText
// @grant       GM_info
// @include     http://*google*
// @updateURL	https://jkundra/lazylinks/Greasemonkey/Example/LazyLinks_Goolge_Example.meta.js
// @downloadURL	https://jkundra/lazylinks/Greasemonkey/Example/LazyLinks_Goolge_Example.user.js
// 
// /* Links data files */
// @resource    linksDataSet   http://jkundra/lazylinks/Greasemonkey/Example/LazyLinks_Goolge_Example.links.json
// ==/UserScript==

var DEBUG_MODE = false; 	// TRUE = shows all logs, FALSE = shows only errors 

unsafeWindow.injectLazyLinks(GM_getResourceText('linksDataSet'), GM_info.script.name);
