var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'mathsolution_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://mathsolution.ru/',
	exclude: [
		'http://www.mathsolution.ru/book-list/',
		'http://www.mathsolution.ru/ortDict',
		'http://www.mathsolution.ru/books/',
		/*
		'',
		'',
		*/
	]
});
