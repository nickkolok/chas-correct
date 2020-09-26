var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name: 'pm298_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause: 3000,
	root: 'http://www.pm298.ru/',
	exclude: [
		'http://www.pm298.ru/.?tab_'
	]
});
