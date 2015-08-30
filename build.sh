#!/bin/bash

#Делаем какую-то магию с переменными окружения по мозилловскому мануалу
cd ext/addon-sdk-1.17
source bin/activate
cd ../..

#Собираем XPI для firefox desktop
cd firefox
cfx xpi
mv chas-correct.xpi ../bin/chas-correct-firefox-desktop.xpi
#И для mobile
cfx xpi --force-mobile
mv chas-correct.xpi ../bin/chas-correct-firefox-mobile.xpi
cd ..

#Для хрома
if [ -f chrome.pem ]; then
  ./crxmake.sh chrome chrome.pem
  mv chrome.crx bin/chas-correct-chrome-desktop.crx
  cp bin/chas-correct-chrome-desktop.crx bin/chas-correct.zip
else
  echo '"chrome.pem" file not found. Skipping Chrome ext build.'
fi

#По просьбам трудящихся - юзерскрипт
cat jquery-2.1.0.min.js jstorage.min.js dictionary.js prepareDictionary.js content.js > bin/chas-correct-userscript.js
