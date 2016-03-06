var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'matematikalegko',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	50,
	reportEvery: 2,
	flushEvery: 150,
	prefix:	'http://matematikalegko.ru/zapisi/page/',
	linkpattern:	'http://matematikalegko.ru/',
	linkprefix:	'',
	pause:1000,
});
