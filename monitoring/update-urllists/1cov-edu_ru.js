var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10,
	name:	'1cov-edu_ru',
});

var sitemaps = [
	'http://1cov-edu.ru/vse_razdeli/',
];


for (var i = 0; i < sitemaps.length; i++) {
	extractor.extractURLlistFromURLsequence({
		pagesCount:	1,
		reportEvery: 1,
		flushEvery: 1,
		prefix:	sitemaps[i]+'#',
		linkpattern:	'/',
		linkprefix:	'http://1cov-edu.ru',
		pause:500,
	});
}
