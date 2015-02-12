rem npm install -g jsdoc
rem npm install ink-docstrap
rm -R docs
jsdoc -c ./conf.json ./../LazyLinks/Readme.md
rem docker -i iMacros -o docs