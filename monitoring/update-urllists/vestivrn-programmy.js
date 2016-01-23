var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 60*1000,
	name:       'vestivrn-programmy',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	100,
	prefix:	'http://vestivrn.ru/programmy?page=',
	linkpattern:	'/programmy/',
	linkprefix:	'http://vestivrn.ru',
});
