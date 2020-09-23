var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name: 'math4school_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause: 3000,
	root: 'http://math4school.ru/',
});

