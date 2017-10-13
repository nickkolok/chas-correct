var fs = require('fs');
var cheerio = require('cheerio');

var name = process.argv[2];

var $ = cheerio.load(
	fs.readFileSync(
		'results/' + name + '.report.html',
		'utf-8'
	)
);

var chunksWithErrors = [];
$('tr').map(function(i, tr) {
	var td = $('td', tr)[1];
	if(td && $(td).text()) {
		chunksWithErrors.push($(td).text());
	}
});

var dictionary = require('../prepareDictionary.js').actionArray;
console.log(dictionary);

var freqs = [];

for(var i = 0; i < dictionary.length; i++) {
	//console.log(i);
	freqs[i] = 0;
	for(var j = 0; j < chunksWithErrors.length; j++) {
		var newtext = chunksWithErrors[j].replace(dictionary[i][0],dictionary[i][1]);

		if( newtext !== chunksWithErrors[j] ) {
			//console.log('!' + i);
			freqs[i]++;
		}
	}
}

var pairs = [];
for (var i = 0; i < dictionary.length; i++) {
	if (freqs[i]) {
		/*
		if(!dictionary[i][3]) {
			console.log(dictionary[i]);
		}
		*/
		pairs.push([dictionary[i], freqs[i]/*, i*/]);
//		pairs.push([dictionary[i][3] || dictionary[i][2], freqs[i]]);
	}
}
pairs.sort(function(a,b){return b[1]-a[1]});

console.log(pairs);
