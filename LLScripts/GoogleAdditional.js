/**
 * Additional examples
 */

/**
 * Example 1
 * Using imported (and extended) iMacros script
 */
var googlePage = macros('./json/Google.json');

googlePage.searchField.value('Test')
googlePage.searchBtn.click();

googlePage.searchField.value('Again')
googlePage.searchBtn.click();

/**
 * Example 1.2
 * This example same as first but less code and more readable
 */
googlePage
	.searchField.value('Test')
	.searchBtn.click();

googlePage
	.searchField.value('Again')
	.searchBtn.click();


/**
 * Example 2
 * Play iMacros script from javascript
 */
play('./Google.iim');

/**
 * Example 3
 * Play iMacro code line
 */
playMacro("TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=", "value");
playMacro("TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=value");

/**
 * Example 3.1
 * Play multiline iMacros script, but not recomended, please use example 3 instead.
 */
var iimScript = ""
iimScript += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=Test" + "\n";
iimScript += "TAG POS=1 TYPE=BUTTON FORM=ID:tsf ATTR=NAME:btnG" + "\n";
iimScript += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=again" + "\n";
iimScript += "TAG POS=1 TYPE=BUTTON FORM=ID:tsf ATTR=NAME:btnG" + "\n";
playMacro(iimScript);
