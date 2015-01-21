# LazyLinks makes augmented web page
*LazyLinks* injects user predefined links to web page without changing web page sources on server side. 

## About 
*LazyLinks* made of two parts: *Greasemonkey* scripts and *iMacros*. scripts *Greasemonkey* responsible of links injection to web application, *iMacros* responsible of scripts execution.

## How to Install
- Clone *LazyLinks* repository
    + `hg clone http://joku.lt:8080/scm/hg/LazyLinks/`
    + Rename `Properties.sample.iim` to `Properties.iim` and open in the text editor
        * Change properties paths
- Open Firefox browser
    + Install **Greasemonkey** add-on
        1. Install *LazyLinks Engine*. Through the browser navigate to cloned *LazyLinks* repository on your file system (example: `file:///c:/path/to/LazyLinks/Greasemonkey/Engine`) click on **LazyLinks.user.js** file and click **Install** button on pop-up
        2. Install *LazyLinks data sets*. Through the browser navigate to data sets folder (example: `file:///c:/path/to/LazyLinks/Greasemonkey/EIS_Group_Benefits`) and click on file with extension **\*.user.js**  click **Install** button on pop-up
    + Install **iMacros** add-on 
        * Open iMacros > Settings and set *Folder Macros* = `c:/path/to/LazyLinks/iMacros`

## How it Works
- Greasemonkey starts script `LazyLinks.user.js` and injects  LazyLinks Engine sources to page sources
    + `LazyLinks.user.js` automatically injects hidden HTML element with id `paramsBroker` this element uses as parameters holder.
- Greasemonkey starts second user created script **\*.user.js** and this script injects  user predefined links (json data sets) it to web page using LazyLinks Engine API.
- Then user clicks on link, it performs actions
    1. Execute java script inserted on clickled link `onclick` attribute. This java script updates web element with id `paramsBroker`  attribute `value`  and sets value predefined on java script (source code: `InjectLazylinks.js#createLink()`). 
    2. Change window.location to `imacros://run/?m=Proxy.js` and it automatically opens *iMacros* add-on and starts `Proxy.js` script. `Proxy.js` reads value from web element with id `paramsBroker`  attribute `value` and starts executing script.

## How to Create Custom LazyLinks script
TBD

## How to Use
TBD

## How to Override Links
TBD
