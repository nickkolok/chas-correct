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
		'http://www.mathsolution.ru/slang-list/',
		'http://www.mathsolution.ru/slang/',
		'http://www.mathsolution.ru/school/',
		'http://www.mathsolution.ru/school-list/',
		'http://www.mathsolution.ru/college-list/',
		'http://www.mathsolution.ru/college/',
		'http://www.mathsolution.ru/referat/', // Архивы
		'http://www.mathsolution.ru/ref-list/',
		'http://www.mathsolution.ru/univer-list/',
	]
});
