// ==UserScript==
// @name        LazyLinks - Google Example
// @description LazyLinks - Google Example
// @namespace   LazyLinks
// @grant       GM_getResourceText
// @grant       GM_info
// @include     http://*google*
// @icon        https://github.com/jonkun/LazyLinks/raw/master/icons/icon128.png
// @icon64      https://github.com/jonkun/LazyLinks/raw/master/icons/icon64.png
// @updateURL	https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.meta.js
// @downloadURL	https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.user.js
// 
// /* Links data files */
// @resource    linksDataSet   https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.links.json
// ==/UserScript==

unsafeWindow.injectLazyLinks(GM_getResourceText('linksDataSet'), GM_info.script.name);
