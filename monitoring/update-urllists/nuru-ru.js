var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name:	'nuru-ru',
});

var sitemaps = [
	'http://www.nuru.ru/mat/alg.htm',
	'http://www.nuru.ru/mat/geom.htm',
	'http://www.nuru.ru/teorver.htm',
];


for (var i = 0; i < sitemaps.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	sitemaps[i]+'#',
		linkpattern:	'http://nuru.ru',
		linkprefix:	'',
		pause:2000,
	});
}
