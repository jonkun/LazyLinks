:: npm install -g jsdoc
:: npm install ink-docstrap
rm -R docs
call jsdoc -c ./conf.json ./Readme.md

