var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10*1000,
	name:	'ege-ok',
});

extractor.extractURLlistFromURLsequence({
	pagesCount:	70,
	reportEvery: 2,
	flushEvery: 150,
	prefix:	'https://ege-ok.ru/reshenie-zadach-po-matematike/page/',
	linkpattern:	'//ege-ok.ru/',
	linkprefix:	'https:',
	pause:10000,
});
