var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'm36on',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	2200,
	reportEvery: 50,
	prefix:	'http://m.36on.ru/news?page=',
	linkpattern:	'/news/',
	linkprefix:	'http://m.36on.ru/',
	pause:500,
});
