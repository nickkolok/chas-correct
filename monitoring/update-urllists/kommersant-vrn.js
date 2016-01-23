var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var months=['01','02','03','04','05','06','07','08','09','10','11','12',];


var extractor = new LinkExtractor({
	flushEvery: 30*1000,
	name:       'kommersant-vrn',
});


for(var year=2013; year<=2016; year++){
	for(var i=0; i<12; i++){
		extractor.extractURLlistFromURLsequence({
			pagesCount:	32,
			reportEvery: 10,
			prefix:	'http://www.kommersant.ru/archive/news/36/'+year+'-'+months[i]+'-',
			linkpattern:	'/news/',
			linkprefix:	'http://www.kommersant.ru',
		});
	}
}
