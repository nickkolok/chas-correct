var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'ege-ok',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	50,
	reportEvery: 2,
	flushEvery: 150,
	prefix:	'http://ege-ok.ru/zapisi/page/',
	linkpattern:	'http://ege-ok.ru/',
	linkprefix:	'',
	pause:2000,
});
