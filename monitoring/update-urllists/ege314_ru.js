var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 5000,
	name: 'ege314_ru',
});


extractor.extractURLlistFromURLsequence({
	pagesCount: 60,
	reportEvery: 10000,
	flushEvery: 10000,
	prefix: 'https://ege314.ru/sitemap/',
	linkpattern: 'https://ege314.ru/',
	linkprefix: '',
	pause: 2000,
	exclude: [
		'https://ege314.ru/sitemap/',
	]
});
