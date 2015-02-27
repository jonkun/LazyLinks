<!-- Change favicon.icon -->
<script type="text/javascript">
    var faviconNode = document.createElement('link');
    faviconNode.setAttribute('rel', 'shortcut icon');
    faviconNode.setAttribute('href', 'favicon.ico');
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(faviconNode);
</script>

## [LazyLinks Scripts Documentation](./docs/Scripts/EIS/Login/LoginAsQa.js.html)


## LazyLinks makes augmented web page
*LazyLinks* injects user predefined links to web page without changing web page sources on server side. 

## About 
*LazyLinks* made of two parts: *Greasemonkey* scripts and *iMacros* scripts. *Greasemonkey* responsible of links injection to web applications, *iMacros* responsible of script execution.

## How to Install
<a href="path/to/file" download>Click here to download</a>
- Clone *LazyLinksEngine* repository
    + `hg clone http://jkundra:9090/scm/hg/LazyLinksEngine`
- Open Firefox browser and open Add-ons window `Menu > Tools > Add-ons`
    + Install **Greasemonkey** and **iMacros** add-ons and restart firefox
    + Install bottom user scripts:
        * Click here: [LazyLinks.user.js](http://jkundra/lazylinks/Greasemonkey/engine/LazyLinks.user.js) - LazyLinks javascript API
        * Click here: [EIS_General.user.js](http://jkundra/lazylinks/Greasemonkey/EIS_General/EIS_General.user.js) - General links for EIS Application
        * Click here: [EIS_Group_Benefits.user.js](http://jkundra/lazylinks/Greasemonkey/EIS_Group_Benefits/EIS_Group_Benefits.user.js) - Links only for EIS Group Benefits Team.
    + Open iMacros settings window, click on `iMacros icon` ![iMacrosIcon](http://wiki.imacros.net/upload/5/5a/IMacros-icon.png) `on toolbar > Manage tab > Settings button`:
        * Click on `General` tab.
            - Uncheck `Show Javascript during replay`
        * Click on `Paths` tab  
            - Set `Folder Macros` = `c:\path\to\LazyLinksEngine\iMacros\`


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
```javascript
THIS TEXT WILL BE CHANGED ON PAGE LOAD
```

**Links DataSet:** [Google_Example_FULL.links.json](./Greasemonkey/Example/Google_Example_FULL.links.json)
```json
THIS TEXT WILL BE CHANGED ON PAGE LOAD
```

## How to Override Links
TBD

<!-- Script load file content -->
<script type="text/javascript">

window.onload = function() {

    // Different mardown tools generate different html source
    var elements = document.getElementsByClassName('pln');
    if (elements.length === 0) {
        elements = document.getElementsByClassName('javascript');
    }
    
    // Inject javascript file
    var javascriptExampleElement = elements[0]
    javascriptExampleElement.innerHTML = load('./Greasemonkey/Example/Google_Example.user.js');
    
    // Different mardown tools generate different html source
    // Inject json file
    var jsonExampleElement = elements[1]
    jsonExampleElement.innerHTML = load('./Greasemonkey/Example/Google_Example_FULL.links.json').toString();

    function load( url ) {
        var ajax = new XMLHttpRequest();
        ajax.open( 'GET', url, false ); // <-- the 'false' makes it synchronous
        var script = null;
        ajax.onreadystatechange = function () {
            script = ajax.response || ajax.responseText;
            if (ajax.readyState === 4) {
                switch( ajax.status) {
                    case 200:
                        console.log("script loaded: ", url);
                        break;
                    default:
                        console.log("ERROR: script not loaded: ", url);
                }
            }
        };
        ajax.send(null);
        return script;
    }
}
</script>