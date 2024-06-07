Инструкция по запуску мониторинга

Запуск мониторинга производится в два этапа:
1. Обновление url-листов через скрипты в monitoring/update-urllists
2. Запуск самого мониторинга через скрипты в monitoring/scripts

Этап 1. Обновление url-листов
1) Необходим модуль js-crawler, если он не установлен, то устанавливаем его через команду:
>npm install js-crawler
2) Переходим в каталог monitoring посредством команды:
>cd monitoring
3) Запускаем нужный скрипт(имя скрипта(fileName) - это название сайта) через команду:
>node update-urllists/fileName.js
4) Начнется обновление url-листа данного сайта, который находится в monitoring/urllists с названием fileName.urllist.json.
5) Обновление нужно завершать вручную через закрытие терминала, обычно, когда 5-10 проходов не дали
результата(т.е. количество сайтов не изменилось) - можно завершать обновление.
Дополнительно:
Если Вам необходимо исключить некоторые сайты или цепочку сайтов, то можно использовать исключения,
т.е. добавить их перед запуском в exclude скрипта обновления url-листов, исключения поддерживают как строки, так и регулярные выражения.

Этап 2. Запуск мониторинга
1) Переходим в каталог monitoring посредством команды:
>cd monitoring
2) Создаем папку monitoring/dumps через команду
>mkdir dumps
3) Только для пользователей ОС Windows:
    3.1) Удаляем файл prepareDictionary.js в корневом каталоге
    3.2) Теперь необходимо создать символическую ссылку на файл chrome/prepareDictionary.js,
    запускаем PowerShell от имени администратора, создаем симлинк через команду:
    >New-Item -ItemType SymbolicLink -Path ".../chas-correct/prepareDictionary.js" -Target ".../chas-correct/chrome/prepareDictionary.js"
    (Как пример:
    >New-Item -ItemType SymbolicLink -Path "D:/Projects/chas-correct/prepareDictionary.js" -Target "D:/Projects/chas-correct/chrome/prepareDictionary.js"
    )
4) Запускаем скрипт мониторинга в monitoring/scripts, посредством команды:
>node scripts/fileName.js
Если нужного скрипта в monitoring/scripts нет, то можно использовать универсальный скрипт через команду:
>node scripts/universal.js fileName
5) После завершения мониторинга результаты появятся в папке monitoring/results в виде 7 файлов
