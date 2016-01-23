var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 60*1000,
	name:	'riavrn',
});

var rubrics=[
	'accidents',
	'society',
	'culture',
	'sport',
	'gov',
	'economy',
	'afisha/movie',
	'opinions',
//	'reporter',
//	'news',
];

for(var i=0; i<rubrics.length; i++){
	extractor.extractURLlistFromURLsequence({
		pagesCount:	300,
		reportEvery: 50,
		prefix:	'http://m.riavrn.ru/'+rubrics[i]+'/?load=y&PAGEN_1=',
		linkpattern:	'/'+rubrics[i]+'/',
		linkprefix:	'http://m.riavrn.ru',
	});
}
