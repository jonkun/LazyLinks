/**
 * Example
 */

var googlePage = macros('./json/Google.json');

googlePage.searchField.value('JS TEST');
googlePage.searchBtn.click();

googlePage.searchField.value('JS AGAIN');
googlePage.searchBtn.click();







/* Additional examples: */
/* Example 1 */
play('./Google.iim');

/* Example 2 */
playMacro("TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=", "value");

/* Example 3 */
var iimScript = ""
iimScript += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=Test" + "\n";
iimScript += "TAG POS=1 TYPE=BUTTON FORM=ID:tsf ATTR=NAME:btnG" + "\n";
iimScript += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:tsf ATTR=ID:lst-ib CONTENT=again" + "\n";
iimScript += "TAG POS=1 TYPE=BUTTON FORM=ID:tsf ATTR=NAME:btnG" + "\n";
playMacro(iimScript);
