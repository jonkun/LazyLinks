<!-- Change favicon.icon -->
<script type="text/javascript">
    var faviconNode = document.createElement('link');
    faviconNode.setAttribute('rel', 'shortcut icon');
    faviconNode.setAttribute('href', 'favicon.ico');
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(faviconNode);
</script>

## LazyLinks makes augmented web page
*LazyLinks* injects user predefined links to web page without changing web page sources on server side. 

## About 
*LazyLinks* made of two parts: *Greasemonkey* scripts and *iMacros* scripts. *Greasemonkey* responsible of links injection to web applications, *iMacros* responsible of script execution.

## How to Install
- Install [Firefox](https://www.mozilla.org/en-US/firefox/new/) browser
- Open Firefox browser and navigate to add-ons window `Menu > Tools > Add-ons`
    + Find and Install **Greasemonkey** and **iMacros** add-ons when restart firefox
    + Download and save <a href="https://github.com/jonkun/LazyLinks/raw/master/iMacros/Install.js" download>Install.js</a> file to iMacros scripts folder
    + Install bottom Greasemonkey user scrip, click here: [Google_Example.user.js](https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.user.js)

## How it Works
- Greasemonkey starts script `LazyLinks.user.js` and injects  LazyLinks Engine sources to page sources
    + `LazyLinks.user.js` automatically injects hidden HTML element with id `paramsBroker` this element uses as parameters holder.
- Greasemonkey starts second user created script **\*.user.js** and this script injects  user predefined links (json data sets) it to web page using LazyLinks Engine API.
- Then user clicks on link, it performs actions:
    1. Execute javascript inserted on clickled link `onclick` attribute. This java script updates web element with id `paramsBroker`  attribute `value`  and sets value predefined on java script (source code: `InjectLazylinks.js#createLink()`). 
    2. Change window.location to `imacros://run/?m=Start.js` and it automatically opens *iMacros* add-on and starts `Start.js` script. `Start.js` reads value from web element with id `paramsBroker`  attribute `value` and starts executing script.


## Versions 
If you are using Firefox **25** or earlier version then please use iMacros **8.6.0** version from [here.](https://addons.mozilla.org/en-US/firefox/addon/imacros-for-firefox/versions/)

## How to Create Custom LazyLinks script, example
**Script:** [Google_Example.user.js](./Greasemonkey/Example/Google_Example.user.js)

**Links DataSet:** [Google_Example_FULL.links.json](./Greasemonkey/Example/Google_Example_FULL.links.json)

