# LazyLinks makes augmented web page
*LazyLinks* injects user predefined links to web page without changing web page sources on server side. 

## About 
*LazyLinks* made of two parts: *Greasemonkey* and *iMacros*. *Greasemonkey* responsible of links injection to web application, *iMacros* responsible of scripts execution.

## How to Install
- Clone *LazyLinks* repository
    + `hg clone http://joku.lt:8080/scm/hg/LazyLinks/`
    + Rename `Properties.sample.iim` to `Properties.iim` and open in the text editor
        * Change properties paths
- Open Firefox browser
    + Install **Greasemonkey** add-on
        * Through the browser navigate to cloned *LazyLinks* repository on your file system (example: `file:///c:/path/to/LazyLinks/Greasemonkey/`) click on **LazyLinks.user.js** file and click **Install** button on pop-up
    + Install **iMacros** add-on 
        * Open iMacros > Settings and set *Folder Macros* = `c:/path/to/LazyLinks/iMacros`

## How it Works
- **Greasemonkey** injects **LazyLinks.user.js** java script
- **LazyLinks.user.js** script injects user predefined links from json data sets it to web page. And injects hidden web element with id `targetScript` this element used as parameter holder.
- Then user clicks on link, it performs actions:
    1. Execute java script inserted on clickled link `onclick` attribute. This java script updates web element with id `targetScript`  attribute `value`  and sets value predefined on java script (source code: `InjectLazylinks.js#createLink()`). 
    2. Change window.location to `imacros://run/?m=Proxy.js` and it automatically opens *iMacros* add-on and starts `Proxy.js` script. `Proxy.js` reads value from web element with id `targetScript`  attribute `value` and starts executing script.

## How to Use
TBD

