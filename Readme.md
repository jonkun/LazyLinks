# How to install
- Clone LazyLinks repository
    + `hg clone http://joku.lt:8080/scm/hg/LazyLinks/`
- Open Firefox browser
    + Install **Greasemonkey** add-on
    + Navigate to LazyLinks repository on your file system (example: `file:///d:/path/to/LazyLinks/Greasemonkey/`) click on **LazyLinks.user.js** file and click **Install** button on pop-up
    + Install **iMacros** add-on 
        * Open iMacros > Settings
        * Set Folder Macros = `d:/path/to/LazyLinks/iMacros`

# How it works
- **Greasemonkey** injects **LazyLinks.user.js** java script
- **LazyLinks.user.js** script injects links from json data sets it to web page and creates hidden web element with id 'targetScript' this element needed for Proxy.js script.
- Then user clicks on link it performs actions:
    1. Update 'targetScript.value' by script on clicked link on 'onclick' attribute (source code: `InjectLazylinks.js#createLink`)
    2. Change window.location to `imacros://run/?m=Proxy.js` it automatically opens iMacros add-on and starts Proxy.js script
        * Proxy.js reads value from 'targetScript.value' and starts target script
