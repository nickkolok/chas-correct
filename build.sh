#!/bin/bash

#Делаем какую-то магию с переменными окружения по мозилловскому мануалу
cd ext/addon-sdk-1.17
source bin/activate
cd ../..

#Собираем XPI для firefox desktop
cd firefox
cfx xpi
mv firefox.xpi ../bin/chas-correct-firefox-desktop.xpi
#И для mobile
cfx xpi --force-mobile
mv firefox.xpi ../bin/chas-correct-firefox-mobile.xpi
cd ..

#Для хрома
./crxmake.sh chrome ../correct.pem
mv chrome.crx bin/chas-correct-chrome-desktop.crx
cp bin/chas-correct-chrome-desktop.crx bin/chas-correct.zip





