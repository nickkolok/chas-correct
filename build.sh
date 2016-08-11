#!/bin/bash

#Делаем какую-то магию с переменными окружения по мозилловскому мануалу
cd ext/addon-sdk-1.17
source bin/activate
cd ../..

#Собираем XPI для firefox desktop
cd firefox
cfx xpi
mv chas-correct.xpi ../bin/chas-correct-firefox-desktop-legacy.xpi
#И для mobile
cfx xpi --force-mobile
mv chas-correct.xpi ../bin/chas-correct-firefox-mobile-legacy.xpi

# Если не работает, выполнить:
# sudo npm install jpm -g
# sudo npm install jpm-mobile -g

#Собираем XPI для firefox desktop через jpm

jpm xpi
mv chas-correct.xpi ../bin/chas-correct-firefox.xpi

cd ..

#Для хрома
if [ -f chrome.pem ]; then
  ./crxmake.sh chrome chrome.pem
  mv chrome.crx bin/chas-correct-chrome-desktop.crx
else
  echo '"chrome.pem" file not found. Skipping Chrome ext build.'
fi

#И zip-архив для хрома
zip -qr -9 -X  bin/chas-correct-chrome.zip chrome

#По просьбам трудящихся - юзерскрипт
cat \
	gm/userscript.meta \
	gm/apiwrapper.js \
	dictionary.js \
	prepareDictionary.js \
	content.js \
> bin/chas-correct-userscript.user.js
