/* Global functions list */
// back +
// refresh +
// clear +
// 
// getUrlParam
// goToUrl +
// 
// id
// include
// load
// loadResource
// log
// logError
// logStyled
// macros
// play
// playMacro +
// screenshot +
// tab
// pause +
// wait +
// 
// setCookie
// getCookie
// 
// saveAs
// openFile
// readFile
// writeToFile
// fileDelete

/**
 * Test page: http://demo.imacros.net/
 */

/**
 * Check LazyLinks API functions
 */

/**
 * Test scenario
 * Navigate to www.google.com
 * Enter text '' to search field and click Ok button
 */

clear();

iimDisplay('Load extended iMacros');

var predefinedGoogleMacros = {
	/* Google page iMacros */
	"searchField": "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=",
	"searchBtn": "TAG POS=1 TYPE=BUTTON FORM=ID:tsf ATTR=NAME:btnG"
};

var googlePage = new LLMacros(predefinedGoogleMacros);

goToUrl('www.google.com');


googlePage.searchField.value('LazyLinks web automation tool');
googlePage.searchBtn.click();

// wait(10, 'Waiting 10 seconds');

refresh();

var iMacrosScriptsFolder = config.macrosFolder.replace('file:///', '').replace(/\//g, '\\');
// screenshot(iMacrosScriptsFolder, 'Screenshoot_');

back();

goToUrl('http://wiki.imacros.net/SAVE_ELEMENT_SCREENSHOT');

saveAs(iMacrosScriptsFolder, 'TEST_{{!NOW:yyyymmdd_hhnnss}}', 'htm');

// playMacro('TAG POS=1 TYPE=A ATTR=TXT:Command<SP>Reference');

// pause('Please click Continue');

// goToUrl('http://jkundra:8080/ipb-app');

// screenshot('c:\\src\\', 'testasd');