/**
 * Check LazyLinks API functions 
 */

clear();

goToUrl('http://wiki.imacros.net/SAVE_ELEMENT_SCREENSHOT');

playMacro('TAG POS=1 TYPE=A ATTR=TXT:Command<SP>Reference');

wait(2)

back();

pause('Please click Continue');

refresh();

goToUrl('http://jkundra:8080/ipb-app');

screenshot('c:\\src\\', 'testasd');

