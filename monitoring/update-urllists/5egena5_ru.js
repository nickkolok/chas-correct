var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name: '5egena5_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause: 2000,
	root: 'http://www.5egena5.ru/',
});
