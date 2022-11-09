var fs = require('fs');
var request = require('request');

var reqstring=
    'https://petscan.wmflabs.org/?language=ru&project=wikipedia&depth=15&categories=%D0%9C%D0%B0%D1%82%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%B0&search_max_results=500000&interface_language=en&active_tab=&format=json&sparse=on&doit=1'
;

request(reqstring, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    var parsed = JSON.parse(body);
    parsed = parsed['*'][0].a['*'];
    
    parsed = parsed.map((name)=>encodeURI('https://ru.wikipedia.org/wiki/'+name));
    fs.writeFile(
        'urllists/wikipedia_math.urllist.json',
        JSON.stringify(parsed).replace(/","/g,'",\n"')
    );

});