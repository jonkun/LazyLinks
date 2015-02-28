/**
 * Example
 */

var googlePage = macros('./json/Google.json');

googlePage.searchField.value('JS TEST');
googlePage.searchBtn.click();

googlePage.searchField.value('JS AGAIN');
googlePage.searchBtn.click();