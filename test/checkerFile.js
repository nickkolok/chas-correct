var fs = require('fs');
var actionArray = require('../chrome/prepareDictionary.js').actionArray;

function checkFile(fPathFile) {
    var textRead = fs.readFileSync(fPathFile, 'utf8');
    var strFile = textRead.split('\n').filter(function (strLine, numberLine) {
        var tempStrLine = strLine;
        actionArray.map(function (fActionArray) {
            tempStrLine = tempStrLine.replace(fActionArray[0], fActionArray[1]);
        });
        if ((process.argv[2] == '--log' || process.argv[2] == '--all') && strLine != tempStrLine)
            console.log('Исправлена строка ' + (numberLine + 1));
        return strLine == tempStrLine ? strLine : null;
    }).join('\n');
    if (process.argv[2] == '--save' || process.argv[2] == '--all')
        fs.writeFileSync(fPathFile, strFile);
}

if (process.argv[2] == '--log' || process.argv[2] == '--save' || process.argv[2] == '--all')
    checkFile('../words-to-process.txt');
else
    console.log('--log -вывести результат работы\n--save -сохранить результат работы\n--all -показать и сохранить результат работы');
