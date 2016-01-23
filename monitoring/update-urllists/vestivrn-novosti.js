var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 60*1000,
	name:	'vestivrn-novosti',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	5000,
	prefix:	'http://vestivrn.ru/novosti?page=',
	linkpattern:	'/novosti/',
	linkprefix:	'http://vestivrn.ru',
});
