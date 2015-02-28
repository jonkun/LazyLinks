## LazyLinks makes augmented web page
*LazyLinks* injects user predefined links to web page without changing web page sources. 

## About 
*LazyLinks* made of two parts: *Greasemonkey* scripts and *iMacros* scripts. *Greasemonkey* responsible of links injection to web applications, *iMacros* responsible of script execution.

## How to Install
- Install <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank" download>Firefox</a> browser
- Open Firefox and install <a href="https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/" target="_blank" >Greasemonkey</a> and <a href="https://addons.mozilla.org/en-us/firefox/addon/imacros-for-firefox/" target="_blank" >iMacros</a> add-ons when restart firefox
    + Download and save <a href="https://github.com/jonkun/LazyLinks/raw/master/iMacros/Install.js" target="_blank" download>Install.js</a> file in to iMacros scripts folder
    + Install Greasemonkey user script, click here: [Google_Example.user.js](https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.user.js)

## How it Works
- Greasemonkey starts script `LazyLinks.user.js` and injects  LazyLinks Engine sources to page sources
    + `LazyLinks.user.js` automatically injects hidden HTML element with id `paramsBroker` this element uses as parameters holder.
- Greasemonkey starts second user created script **\*.user.js** and this script injects  user predefined links (json data sets) it to web page using LazyLinks Engine API.
- Then user clicks on link, it performs actions:
    1. Execute javascript inserted on clickled link `onclick` attribute. This java script updates web element with id `paramsBroker`  attribute `value`  and sets value predefined on java script (source code: `InjectLazylinks.js#createLink()`). 
    2. Change window.location to `imacros://run/?m=Start.js` and it automatically opens *iMacros* add-on and starts `Start.js` script. `Start.js` reads value from web element with id `paramsBroker`  attribute `value` and starts executing script.


## Versions 
If you are using Firefox **25** or earlier version then please use iMacros **8.6.0** version from [here.](https://addons.mozilla.org/en-US/firefox/addon/imacros-for-firefox/versions/)

## How to Create Custom LazyLinks scripts
**Script example:** [Google_Example.user.js](./Greasemonkey/Example/Google_Example.user.js)

**DataSet example:** [Google_Example_FULL.links.json](./Greasemonkey/Example/Google_Example_FULL.links.json)

**LazyLinks Player script examples:** [GoogleExample1.js](./Greasemonkey/Example/Google_Example_FULL.links.json)
