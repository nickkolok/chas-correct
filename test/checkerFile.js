var fs = require('fs');
var actionArray = require('../chrome/prepareDictionary.js').actionArray;

function correctionFile(fPathFile){
    var textRead = fs.readFileSync(fPathFile, 'utf8');
    var strLine = '';
    var tempStrLine = '';
    var strFile = '';
    var lineNumber = 0;
    for (var i = 0; i < textRead.length; i++) {
        if (textRead[i] != '\n')
            strLine += textRead[i];
        else {
            tempStrLine = strLine;
            for (var j = 0; j < actionArray.length; j++)
                tempStrLine = tempStrLine.replace(actionArray[j][0], actionArray[j][1]);
            if(tempStrLine != strLine) {
                console.log("Исправлена строка " + (lineNumber + 1));
                //console.log("Исправлена строка " + (lineNumber + 1) + ": " + strLine + " -> " + tempStrLine); //проблемы с выводом
            }
            else
                strFile += strLine + '\n';
            strLine = '';
            lineNumber++;
        }
    }
    fs.writeFileSync(fPathFile, strFile);
}

correctionFile('../words-to-process.txt');
