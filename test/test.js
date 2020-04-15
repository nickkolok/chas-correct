var actionArray = require('../chrome/prepareDictionary.js').actionArray;
var testDictionary = require("./testDictionary").testDictionary;

function tested(fDictionary, fActionArray)
{
        var countFActionArray = 0;
        while(countFActionArray < fActionArray.length)
        {
            fDictionary[0] = fDictionary[0].replace(fActionArray[countFActionArray][0], fActionArray[countFActionArray][1]);
            countFActionArray++;
        }
        if(fDictionary[0] == fDictionary[1])
            return true;
        else
            return false;
}

QUnit.test( "TEST-TEST", function(errorMessage){
    var count = 0;
    while(count < testDictionary.length)
    {
        errorMessage.ok(tested(testDictionary[count], actionArray),
        "Ошибка в слове testDictionary[" + count + "]: [" + testDictionary[count] + "]");
        count++;
    }
});

//для запуска в консоле использовал: qunit test.js
