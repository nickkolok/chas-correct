var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 2000,
	name: 'riavrn_ru',
});


extractor.extractURLlistFromURLsequence({
	pagesCount: 500,
	reportEvery: 2000,
	flushEvery: 2000,
	prefix: 'https://riavrn.ru/news/page/',
	linkpattern: 'https://riavrn.ru/news/',
	linkprefix: '',
	pause: 2000
});
