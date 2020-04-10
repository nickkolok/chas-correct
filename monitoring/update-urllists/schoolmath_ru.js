var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'schoolmath_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'http://schoolmath.ru/',
});
