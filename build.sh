#!/bin/bash

#Делаем какую-то магию с переменными окружения по мозилловскому мануалу
cd ext/addon-sdk-1.17
source bin/activate
cd ../..

#Собираем XPI для firefox desktop
cd chas-correct-firefox
cfx xpi
mv firefox.xpi chas-correct-firefox-desktop.xpi
cfx xpi --force-mobile
mv firefox.xpi chas-correct-firefox-mobile.xpi
cd ..






