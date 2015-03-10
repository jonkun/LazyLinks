/* Global functions list */
// back
// clear
// fileDelete
// getCookie
// getUrlParam
// goToUrl
// id
// include
// load
// loadResource
// log
// logError
// logStyled
// macros
// openFile
// pause
// play
// playMacro
// readFile
// refresh
// saveAs
// screenshot
// setCookie
// tab
// wait
// writeToFile

/**
 * Test page: http://demo.imacros.net/
 *
 */

/**
 * Test scenario
 * Navigate to www.google.com
 * Enter text '' to search field and click Ok button
 */

clear();

iimDisplay('Load extended iMacros');

var predefinedMacros = {
	/* Google page iMacros */
	"searchField": "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=",
	"searchBtn": "TAG POS=1 TYPE=BUTTON FORM=ID:tsf ATTR=NAME:btnG"
};

var googlePage = new LLMacros(predefinedMacros);

goToUrl('www.google.com');


googlePage.searchField.value('LazyLinks web automation tool');
googlePage.searchBtn.click();

wait(10, 'Waiting 10 seconds');

refresh();


back();

// screenshot('config.macrosFolder', 'Screenshoot_' + new Date());

// goToUrl('http://');

/**
 * Check LazyLinks API functions
 */



// goToUrl('http://wiki.imacros.net/SAVE_ELEMENT_SCREENSHOT');

// playMacro('TAG POS=1 TYPE=A ATTR=TXT:Command<SP>Reference');


// pause('Please click Continue');


// goToUrl('http://jkundra:8080/ipb-app');

// screenshot('c:\\src\\', 'testasd');