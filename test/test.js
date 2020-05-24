var actionArray = require('../chrome/prepareDictionary.js').actionArray;
var testDictionary = require('./testDictionary.js').testDictionary;

function testing(fDictionary) {
    actionArray.map(function (fActionArray) {
        fDictionary[0] = fDictionary[0].replace(fActionArray[0], fActionArray[1]);
    });
    return fDictionary[0] == fDictionary[1];
}

QUnit.test("QUnit test: checking words from testDictionary.js", function (errorMessage) {
    for (var i = 0; i < testDictionary.length; i++)
        errorMessage.ok(testing(testDictionary[i]), "Ошибка в слове testDictionary[" + i + "]: [" + testDictionary[i] + "]");
});
