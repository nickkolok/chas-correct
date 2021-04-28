var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var months=['01','02','03','04','05','06','07','08','09','10','11','12',];


var extractor = new LinkExtractor({
	flushEvery: 1000,
	name:       'kommersant-vrn',
});


for(var year=2018; year<=2030; year++){
	for(var i=0; i<12; i++){
		extractor.extractURLlistFromURLsequence({
			pagesCount:	1,
			reportEvery: 1000,
			prefix:	'https://www.kommersant.ru/archive/news/36/month/'+year+'-'+months[i]+'-01#',
			linkpattern:	'/doc/',
			linkprefix:	'https://www.kommersant.ru',
			pause: 1000,
		});
	}
}
