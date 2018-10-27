var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10,
	name:	'lifehacker',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	3000,
	reportEvery: 10,
	flushEvery: 10,
	prefix:	'https://lifehacker.ru/list/page/',
	linkpattern:	'https://lifehacker.ru/',
	linkprefix:	'',
	pause:500,
});

