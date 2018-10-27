var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name:	'cleverstudents',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	1,
	reportEvery: 1000,
	flushEvery: 1000,
	prefix:	'http://www.cleverstudents.ru/sitemap.html#',
	linkpattern:	'',
	linkprefix:	'',
	pause:2000,
});
