var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'webmath_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://webmath.ru/',
	exclude:[
		'http://www.webmath.ru/forum/',
	]
});
