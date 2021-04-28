var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 2000,
	name: 'vrntimes',
});


extractor.extractURLlistFromURLsequence({
	pagesCount: 500,
	reportEvery: 2000,
	flushEvery: 2000,
	prefix: 'http://vrntimes.ru/frontpage?page=',
	linkpattern: '/articles/',
	linkprefix: 'http://vrntimes.ru/print',
	pause: 2000
});
