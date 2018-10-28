var LinkExtractor = require('../../parser/linkExtractor.js').LinkExtractor;

var extractor = new LinkExtractor({
	flushEvery: 10000,
	name:	'edu_govvrn_ru',
});


extractor.extractURLlistFromSiteRecursive({
	pause:5000,
	root: 'https://edu.govvrn.ru/',
});
