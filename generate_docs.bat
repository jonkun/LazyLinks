:: npm install -g jsdoc
:: npm install ink-docstrap
rm -R docs
call jsdoc -c ./conf.json ./../LazyLinks/Readme.md

:: Copy icon files
copy icons\icon128.png docs
copy icons\icon64.png docs
copy icons\favicon.ico docs

cd docs
mklink /j docs .\..\..\LazyLinks\docs
mklink /j Greasemonkey .\..\..\LazyLinks\Greasemonkey

:: iMacrosEngine folder for version checking
mklink /j iMacrosEngine .\..\

