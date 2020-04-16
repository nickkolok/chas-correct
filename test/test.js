var actionArray = require('../chrome/prepareDictionary.js').actionArray;
var testDictionary = require('./testDictionary.js').testDictionary;

function tested(fDictionary, fActionArray)
{
        var countFActionArray = 0;
        while(countFActionArray < fActionArray.length)
        {
            fDictionary[0] = fDictionary[0].replace(fActionArray[countFActionArray][0], fActionArray[countFActionArray][1]);
            countFActionArray++;
        }
            return fDictionary[0] == fDictionary[1] ?  true : false;
}

QUnit.test( "QUnit test: checking words from testDictionary.js", function(errorMessage){
    var count = 0;
    while(count < testDictionary.length)
    {
        errorMessage.ok(tested(testDictionary[count], actionArray),
        "Ошибка в слове testDictionary[" + count + "]: [" + testDictionary[count] + "]");
        count++;
    }
});

//для запуска в консоле использовал: qunit test.js
