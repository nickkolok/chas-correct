var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'matematikalegko',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	60,
	reportEvery: 2,
	flushEvery: 150,
	prefix:	'https://matematikalegko.ru/zapisi/page/',
	linkpattern:	'//matematikalegko.ru/',
	linkprefix:	'https:',
	pause:5000,
});
