var actionArray = require('../chrome/prepareDictionary.js').actionArray;
var testDictionary = require('./testDictionary.js').testDictionary;

function testing(fDictionary, fActionArray) {
    for (var i = 0; i < fActionArray.length; i++)
        fDictionary[0] = fDictionary[0].replace(fActionArray[i][0], fActionArray[i][1]);
    return fDictionary[0] == fDictionary[1] ? true : false;
}

QUnit.test("QUnit test: checking words from testDictionary.js", function (errorMessage) {
    for (var i = 0; i < testDictionary.length; i++)
        errorMessage.ok(testing(testDictionary[i], actionArray), "Ошибка в слове testDictionary[" + i + "]: [" + testDictionary[i] + "]");
});

//для запуска в консоле использовал: qunit test.js
