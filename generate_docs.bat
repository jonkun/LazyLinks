:: npm install -g jsdoc
:: npm install ink-docstrap
rm -R docs
jsdoc -c ./conf.json ./../LazyLinks/Readme.md

:: docker -i iMacros -o docs