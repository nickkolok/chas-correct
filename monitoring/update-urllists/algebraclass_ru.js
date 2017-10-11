var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10,
	name:	'algebraclass_ru',
});


extractor.extractURLlistFromURLsequence({
	pagesCount:	10,
	reportEvery: 10000,
	flushEvery: 10000,
	prefix:	'http://www.algebraclass.ru/sitemap/?pg=',
	linkpattern:	'http://www.algebraclass.ru/',
	linkprefix:	'',
	pause:5000,
});
