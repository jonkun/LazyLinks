// Preconditions: 
// User opened page www.google.com

var googlePage = macros('./json/Google.json');

googlePage
	.searchField.value('Test')
	.searchBtn.click();

googlePage
	.searchField.value('Again')
	.searchBtn.click();