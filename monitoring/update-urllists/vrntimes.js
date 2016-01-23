var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 60*1000,
	name:       'vrntimes',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	1500,
	prefix:	'http://vrntimes.ru/frontpage?page=',
	linkpattern:	'/articles/',
	linkprefix:	'http://vrntimes.ru/print',
});
