## LazyLinks project objectives
- One click solution to fill forms and perform actions.
- To work on current browser session. User don't need to start antoher browser or third party software (like selenium server).
- Easy to read and maintain scripts. iMacros scripts syntax is complext and it is hard to read, so using LazyLinks API you can wrap iMacros scripts to javascript syntax. Example.: two same scripts: [using javascript](./LLScripts/Google.js) and [using iMacros](./LLScripts/Google.iim).
- Self script update. User don't need checkout new version of scripts when scripts are updated, because LazyLinks Player downloads script from (local or remote) repository before script execution.

## LazyLinks makes augmented web page
*LazyLinks* injects user predefined links to web page without changing web page sources. 

## About 
*LazyLinks* made of two parts: *Greasemonkey* scripts and *iMacros* scripts. *Greasemonkey* responsible of links injection to web applications, *iMacros* responsible of script execution.

## How to Install
- Install <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank" download>Firefox</a> browser
- Open Firefox and install <a href="https://addons.mozilla.org/en-us/firefox/addon/greasemonkey/" target="_blank" >Greasemonkey</a> and <a href="https://addons.mozilla.org/en-us/firefox/addon/imacros-for-firefox/" target="_blank" >iMacros</a> add-ons when restart firefox
    + Download and save <a href="https://github.com/jonkun/LazyLinks/raw/master/iMacros/Install.js" target="_blank" download>Install.js</a> file in to iMacros scripts folder. Rename `Install.js.txt` file to `Install.js`
    + Enter this `imacros://run/?m=Install.js` to address field and press enter, when on popup click Allow button
    + Open iMacros settings window, click on `iMacros icon` ![iMacrosIcon](http://wiki.imacros.net/upload/5/5a/IMacros-icon.png) `on toolbar > Manage tab > Settings button`:
        * Click on `General` tab.
            - Uncheck `Show Javascript during replay`
    + Install Greasemonkey user script, click here: [Google_Example.user.js](https://github.com/jonkun/LazyLinks/raw/master/Greasemonkey/Example/Google_Example.user.js)
        * To check open <a href="https://www.google.com" target="_blank" download>www.google.com</a> you will see new links: 
    

## How it Works
- Greasemonkey starts script `LazyLinks.user.js` and injects  LazyLinks Engine sources to page sources
    + `LazyLinks.user.js` automatically injects hidden HTML element with id `paramsBroker` this element uses as parameters holder.
- Greasemonkey starts second user created script **\*.user.js** and this script injects  user predefined links (json data sets) it to web page using LazyLinks Engine API.
- Then user clicks on link, it performs actions:
    1. Execute javascript inserted on clickled link `onclick` attribute. This java script updates web element with id `paramsBroker`  attribute `value`  and sets value predefined on java script (source code: `InjectLazylinks.js#createLink()`). 
    2. Change window.location to `imacros://run/?m=Start.js` and it automatically opens *iMacros* add-on and starts `Start.js` script. `Start.js` reads value from web element with id `paramsBroker`  attribute `value` and starts executing script.


## How to Create Custom LazyLinks script 
Greasemonkey part:
- Script: [Google_Example.user.js](./Greasemonkey/Example/Google_Example.user.js)
- Data set: [Google_Example.links.json](./Greasemonkey/Example/Google_Example_FULL.links.json)

iMacros part:
- Script using javascript: [Google.js](./LLScripts/Google.js)
- Script using iMacros: [Google.iim](./LLScripts/Google.iim)
- Additional scripts: [GoogleAdditional.js](./LLScripts/GoogleAdditional.js)

## Limitations
- LazyLinks works only on Firefox browser
- If you are using Firefox **25** or earlier version then please use iMacros **8.6.0** version from <a href="https://addons.mozilla.org/en-US/firefox/addon/imacros-for-firefox/versions/?page=1#version-8.6.0" target="_blank" >here.</a>
