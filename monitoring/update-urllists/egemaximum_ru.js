var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'egemaximum_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:2000,
	root: 'http://egemaximum.ru/',
	exclude: [
		/\/\?amp;preview=true/,
	]
});
