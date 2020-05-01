var fs = require('fs');
var actionArray = require('../chrome/prepareDictionary.js').actionArray;

function checkingFile(fPathFile) {
    var textRead = fs.readFileSync(fPathFile, 'utf8');
    strFile = textRead.split('\n').map(function (strLine) {
        var tempStrLine = strLine;
        for (var i = 0; i < actionArray.length; i++)
            tempStrLine = tempStrLine.replace(actionArray[i][0], actionArray[i][1]);
        return strLine == tempStrLine ? strLine : null;
    }).filter(function(strLine){
        return strLine != null;
    }).join('\n');
    fs.writeFileSync(fPathFile, strFile);
}

checkingFile('../words-to-process.txt');
