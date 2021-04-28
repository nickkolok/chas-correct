var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 2000,
	name: 'gorcom36_ru',
});


extractor.extractURLlistFromURLsequence({
	pagesCount: 1000,
	reportEvery: 2000,
	flushEvery: 2000,
	prefix: 'https://gorcom36.ru/content/?PAGEN_1=',
	linkpattern: '/content/',
	linkprefix: 'https://gorcom36.ru',
	pause: 2000,
	exclude: [
		'/?PAGEN_1='
	]
});
