var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 1000,
	name: 'treugolniki_ru',
});


extractor.extractURLlistFromURLsequence({
	pagesCount:	12,
	reportEvery: 10000,
	flushEvery: 10000,
	prefix: 'http://www.treugolniki.ru/sitemap/?pg=',
	linkpattern: 'http://www.treugolniki.ru/',
	linkprefix:	'',
	pause: 5000,
	exclude: [
		'http://www.treugolniki.ru/category/'
	]
});
