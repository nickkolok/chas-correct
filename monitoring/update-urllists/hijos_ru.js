var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10,
	name:	'hijos_ru',
});


extractor.extractURLlistFromURLsequence({
	pagesCount:	10,
	reportEvery: 1,
	flushEvery: 1,
	prefix:	'http://hijos.ru/karta-saita/?pg=',
	linkpattern:	'http://hijos.ru/',
	linkprefix:	'',
	pause:2500,
});
